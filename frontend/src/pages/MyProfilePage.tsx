import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { getMyProfile, updateMyProfile, changeMyPassword } from '../api/userProfile';
import type { UserProfile } from '../types/userProfile';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { validateProfileName, validatePasswordChange } from '../utils/validation';

export const MyProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

  useEffect(() => {
    loadProfile();
  }, []);

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
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      if (err.response?.data?.message) {
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
    } catch (err: any) {
      console.error('Failed to change password:', err);
      if (err.response?.status === 401) {
        setPasswordErrors([err.response?.data?.message || '현재 비밀번호가 일치하지 않습니다.']);
      } else if (err.response?.data?.message) {
        setPasswordErrors([err.response.data.message]);
      } else {
        setPasswordErrors(['비밀번호 변경에 실패했습니다.']);
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-gray-600">로딩 중...</div>
        </div>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
            <p className="mt-1 text-sm text-gray-600">나의 정보와 강의 내역을 확인하세요</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* 비밀번호 변경 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">비밀번호 변경</h2>
            {!isChangingPassword ? (
              <Button onClick={handleTogglePasswordChange}>
                비밀번호 변경
              </Button>
            ) : (
              <div className="space-y-4">
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
                          assignment.termStatus === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
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
                수강 중인 강의 ({profile.enrollments.length}개)
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
                          enrollment.termStatus === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
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

          {/* 강의가 없을 때 */}
          {profile.instructorAssignments.length === 0 && profile.enrollments.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
              <p className="text-gray-500">아직 강의가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
