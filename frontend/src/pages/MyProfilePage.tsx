import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Navbar } from '../components/Navbar';
import { getMyProfile, updateMyProfile, changeMyPassword } from '../api/userProfile';
import { withdrawAccount } from '../api/user';
import { getStudentInformationSystems } from '../api/studentInformationSystem';
import type { UserProfile } from '../types/userProfile';
import type { StudentInformationSystem } from '../types/studentInformationSystem';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { validateProfileName, validatePasswordChange } from '../utils/validation';

export const MyProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sisRecords, setSisRecords] = useState<StudentInformationSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 수정 상태
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // 비밀번호 변경 상태
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // 회원 탈퇴 상태
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // 강사 신청 상태
  const [isApplyingInstructor, setIsApplyingInstructor] = useState(false);
  const [instructorApplicationSuccess, setInstructorApplicationSuccess] = useState('');

  useEffect(() => {
    loadProfile();
    if (user?.role === 'USER') {
      loadSisRecords();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('프로필을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSisRecords = async () => {
    try {
      const data = await getStudentInformationSystems();
      // 현재 유저의 기록만 필터링
      const myRecords = user ? data.filter(record => record.userKey === user.id) : [];
      setSisRecords(myRecords);
    } catch (err) {
      console.error('Failed to load SIS records:', err);
    }
  };

  // 프로필 이름 수정 함수
  const handleEditName = () => {
    setNewName(profile?.name || '');
    setNameError('');
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNewName('');
    setNameError('');
  };

  const handleSaveName = async () => {
    const validation = validateProfileName(newName);
    if (!validation.isValid) {
      setNameError(validation.errors[0]);
      return;
    }

    try {
      setIsUpdatingName(true);
      const updatedUser = await updateMyProfile({ name: newName });

      // AuthContext의 user 정보 업데이트
      if (user) {
        updateUser({
          id: user.id,
          email: user.email,
          name: updatedUser.name,
          role: user.role
        });
      }

      // 프로필 다시 로드
      await loadProfile();
      setIsEditingName(false);
      setNameError('');
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setNameError(err.response.data.message);
      } else {
        setNameError('프로필 수정에 실패했습니다.');
      }
    } finally {
      setIsUpdatingName(false);
    }
  };

  // 비밀번호 변경 함수
  const handleTogglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors([]);
    setPasswordSuccess('');
  };

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    setPasswordErrors([]);
    setPasswordSuccess('');
  };

  const handleChangePassword = async () => {
    const validation = validatePasswordChange(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      passwordForm.confirmPassword
    );

    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await changeMyPassword(passwordForm);

      setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors([]);

      // 3초 후 폼 닫기
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Failed to change password:', err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setPasswordErrors([err.response?.data?.message || '현재 비밀번호가 일치하지 않습니다.']);
        } else if (err.response?.data?.message) {
          setPasswordErrors([err.response.data.message]);
        } else {
          setPasswordErrors(['비밀번호 변경에 실패했습니다.']);
        }
      } else {
        setPasswordErrors(['비밀번호 변경에 실패했습니다.']);
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // 회원 탈퇴 함수
  const handleOpenWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
    setWithdrawPassword('');
    setWithdrawError('');
  };

  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setWithdrawPassword('');
    setWithdrawError('');
  };

  const handleWithdraw = async () => {
    if (!withdrawPassword) {
      setWithdrawError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsWithdrawing(true);
      await withdrawAccount(withdrawPassword);

      alert('회원 탈퇴가 완료되었습니다.');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to withdraw account:', err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setWithdrawError(err.response?.data?.message || '비밀번호가 일치하지 않습니다.');
        } else if (err.response?.data?.message) {
          setWithdrawError(err.response.data.message);
        } else {
          setWithdrawError('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setWithdrawError('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  // 강사 신청 함수
  const handleApplyInstructor = async () => {
    try {
      setIsApplyingInstructor(true);
      // TODO: 실제 API 연동
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInstructorApplicationSuccess('강사 신청이 완료되었습니다. 관리자 승인 후 강사로 활동하실 수 있습니다.');

      setTimeout(() => {
        setInstructorApplicationSuccess('');
      }, 5000);
    } catch (err) {
      console.error('Failed to apply for instructor:', err);
      alert('강사 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsApplyingInstructor(false);
    }
  };

  // 수료증 다운로드 함수
  const handleDownloadCertificate = (courseTitle: string, termNumber: number) => {
    // TODO: 실제 수료증 다운로드 API 연동
    alert(`${courseTitle} (${termNumber}차) 수료증 다운로드 기능은 추후 구현 예정입니다.`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-[#6600FF]/5 flex items-center justify-center">
          <div className="text-gray-600">로딩 중...</div>
        </div>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-[#6600FF]/5 flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </>
    );
  }

  // 결제 내역 (수강 신청 내역)
  const paymentHistory = sisRecords
    .filter(record => record.enrollmentStatus !== 'CANCELLED')
    .sort((a, b) => new Date(b.enrollmentCreatedAt).getTime() - new Date(a.enrollmentCreatedAt).getTime());

  // 수료증 목록 (완강한 강의)
  const certificates = sisRecords.filter(record => record.enrollmentStatus === 'COMPLETED');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-[#6600FF]/5">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
            <p className="mt-1 text-sm text-gray-600">나의 정보를 관리하고 학습 내역을 확인하세요</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* 프로필 정보 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">프로필 정보</h2>
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6600FF] to-[#8833FF] flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <button className="mt-2 text-xs text-[#6600FF] hover:text-[#5500DD] font-medium">
                  사진 변경
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">이름</p>
                  {isEditingName ? (
                    <div className="space-y-2">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        error={nameError}
                        placeholder="이름을 입력하세요"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveName}
                          disabled={isUpdatingName}
                        >
                          {isUpdatingName ? '저장 중...' : '저장'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleCancelEditName}
                          disabled={isUpdatingName}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-base font-medium text-gray-900">{profile.name}</p>
                      <Button size="sm" variant="secondary" onClick={handleEditName}>
                        수정
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">이메일</p>
                  <p className="text-base font-medium text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">역할</p>
                  <p className="text-base font-medium text-gray-900">{profile.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <p className="text-base font-medium text-gray-900">{profile.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 계정 보안 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">계정 보안</h2>
            <div className="space-y-4">
              {/* 비밀번호 변경 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">비밀번호 변경</h3>
                {!isChangingPassword ? (
                  <Button onClick={handleTogglePasswordChange}>
                    비밀번호 변경
                  </Button>
                ) : (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    {passwordSuccess && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">{passwordSuccess}</p>
                      </div>
                    )}
                    {passwordErrors.length > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        {passwordErrors.map((error, index) => (
                          <p key={index} className="text-red-800 text-sm">{error}</p>
                        ))}
                      </div>
                    )}
                    <Input
                      type="password"
                      label="현재 비밀번호"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                    <Input
                      type="password"
                      label="새 비밀번호"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                      placeholder="새 비밀번호를 입력하세요"
                      helperText="8-20자, 특수문자 포함"
                    />
                    <Input
                      type="password"
                      label="새 비밀번호 확인"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                      placeholder="새 비밀번호를 다시 입력하세요"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleChangePassword}
                        disabled={isUpdatingPassword}
                      >
                        {isUpdatingPassword ? '변경 중...' : '변경'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleTogglePasswordChange}
                        disabled={isUpdatingPassword}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* 회원 탈퇴 */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">회원 탈퇴</h3>
                <p className="text-sm text-gray-500 mb-3">
                  회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleOpenWithdrawModal}
                  className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                >
                  회원 탈퇴하기
                </Button>
              </div>
            </div>
          </div>

          {/* 강사 신청 (USER 역할만 표시) */}
          {user?.role === 'USER' && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-purple-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">강사로 활동하기</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    전문 지식을 공유하고 강사로 활동하실 수 있습니다. 신청 후 관리자 승인이 필요합니다.
                  </p>
                  {instructorApplicationSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">{instructorApplicationSuccess}</p>
                    </div>
                  )}
                  <Button
                    onClick={handleApplyInstructor}
                    disabled={isApplyingInstructor}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isApplyingInstructor ? '신청 중...' : '강사 신청하기'}
                  </Button>
                </div>
                <div className="text-6xl">🎓</div>
              </div>
            </div>
          )}

          {/* 쿠폰 & 포인트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">보유 쿠폰</p>
                  <p className="text-2xl font-bold text-[#6600FF]">0장</p>
                </div>
                <div className="w-12 h-12 bg-[#6600FF]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎟️</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">보유 포인트</p>
                  <p className="text-2xl font-bold text-green-600">0P</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
          </div>

          {/* 결제 내역 */}
          {user?.role === 'USER' && paymentHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                결제 내역 ({paymentHistory.length}건)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        결제일
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        강의명
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        차수
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        상태
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paymentHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(record.enrollmentCreatedAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {record.courseTitle}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {record.termNumber}차
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            record.enrollmentStatus === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-[#6600FF]/10 text-[#6600FF]'
                          }`}>
                            {record.enrollmentStatus === 'COMPLETED' ? '수료' : '수강중'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-[#6600FF] hover:text-[#5500DD] font-medium">
                            영수증
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 수료증 관리 */}
          {user?.role === 'USER' && certificates.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                수료증 관리 ({certificates.length}개)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((record) => (
                  <div
                    key={record.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#6600FF]/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {record.courseTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {record.termNumber}차 · 수료일: {new Date(record.enrollmentCreatedAt).toLocaleDateString('ko-KR')}
                        </p>
                        <button
                          onClick={() => handleDownloadCertificate(record.courseTitle, record.termNumber)}
                          className="text-sm text-[#6600FF] hover:text-[#5500DD] font-medium"
                        >
                          수료증 다운로드 →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 강사로 배정된 강의 */}
          {profile.instructorAssignments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                강사로 배정된 강의 ({profile.instructorAssignments.length}개)
              </h2>
              <div className="space-y-4">
                {profile.instructorAssignments.map((assignment) => (
                  <div key={assignment.assignmentId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{assignment.courseTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">{assignment.courseDescription}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-600">차수: {assignment.termNumber}차</span>
                          <span className="text-gray-600">
                            기간: {assignment.startDate} ~ {assignment.endDate}
                          </span>
                          <span className="text-gray-600">
                            수강생: {assignment.currentStudents}/{assignment.maxStudents}명
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          assignment.termStatus === 'ONGOING' ? 'bg-green-100 text-green-800' :
                          assignment.termStatus === 'SCHEDULED' ? 'bg-[#6600FF]/10 text-[#6600FF]' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.termStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 수강 중인 강의 */}
          {profile.enrollments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                수강 신청 내역 ({profile.enrollments.length}개)
              </h2>
              <div className="space-y-4">
                {profile.enrollments.map((enrollment) => (
                  <div key={enrollment.enrollmentId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{enrollment.courseTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">{enrollment.courseDescription}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-600">차수: {enrollment.termNumber}차</span>
                          <span className="text-gray-600">
                            기간: {enrollment.startDate} ~ {enrollment.endDate}
                          </span>
                          <span className="text-gray-600">
                            신청일: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          enrollment.termStatus === 'ONGOING' ? 'bg-green-100 text-green-800' :
                          enrollment.termStatus === 'SCHEDULED' ? 'bg-[#6600FF]/10 text-[#6600FF]' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {enrollment.termStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 강의 및 결제 내역이 없을 때 */}
          {user?.role === 'USER' &&
           profile.instructorAssignments.length === 0 &&
           profile.enrollments.length === 0 &&
           paymentHistory.length === 0 &&
           certificates.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
              <span className="text-6xl mb-4 block">📚</span>
              <p className="text-gray-500 mb-2">아직 수강한 강의가 없습니다</p>
              <p className="text-sm text-gray-400">새로운 강의를 수강해보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">회원 탈퇴</h3>

            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium mb-2">⚠️ 경고</p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>탈퇴 후 계정 정보는 복구할 수 없습니다.</li>
                <li>진행 중인 강의가 있다면 자동으로 취소됩니다.</li>
                <li>강사로 배정된 강의가 있다면 확인이 필요합니다.</li>
              </ul>
            </div>

            {withdrawError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{withdrawError}</p>
              </div>
            )}

            <Input
              type="password"
              label="비밀번호 확인"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={isWithdrawing}
            />

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isWithdrawing ? '탈퇴 처리 중...' : '탈퇴하기'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseWithdrawModal}
                disabled={isWithdrawing}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
