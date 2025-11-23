import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { getMyProfile } from '../api/userProfile';
import type { UserProfile } from '../types/userProfile';

export const MyProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                <p className="text-sm text-gray-500">이름</p>
                <p className="text-base font-medium text-gray-900">{profile.name}</p>
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
