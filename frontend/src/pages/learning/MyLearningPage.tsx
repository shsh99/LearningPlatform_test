import { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentInformationSystems } from '../../api/studentInformationSystem';
import type { StudentInformationSystem } from '../../types/studentInformationSystem';

type TabType = 'ALL' | 'ENROLLED' | 'COMPLETED';

export const MyLearningPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<StudentInformationSystem[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<StudentInformationSystem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  useEffect(() => {
    loadMyCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, activeTab]);

  const loadMyCourses = async () => {
    try {
      setIsLoading(true);
      const data = await getStudentInformationSystems();

      // 현재 로그인한 유저의 강의만 필터링
      const myCourses = user
        ? data.content.filter((course: StudentInformationSystem) => course.userKey === user.id)
        : [];

      setCourses(myCourses);
      setError(null);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    switch (activeTab) {
      case 'ENROLLED':
        filtered = filtered.filter(c => c.enrollmentStatus === 'ENROLLED');
        break;
      case 'COMPLETED':
        filtered = filtered.filter(c => c.enrollmentStatus === 'COMPLETED');
        break;
      default:
        // ALL: 취소된 강의는 제외
        filtered = filtered.filter(c => c.enrollmentStatus !== 'CANCELLED');
    }

    setFilteredCourses(filtered);
  };

  const getRecentCourse = () => {
    return courses
      .filter(c => c.enrollmentStatus === 'ENROLLED' && c.progressPercentage > 0)
      .sort((a, b) => new Date(b.enrollmentCreatedAt).getTime() - new Date(a.enrollmentCreatedAt).getTime())[0];
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-300';
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleEnterCourse = (_courseId: number) => {
    // TODO: 강의실 입장 기능 구현
    alert('강의실 입장 기능은 추후 구현 예정입니다.');
  };

  const handleDownloadCertificate = (courseName: string) => {
    // TODO: 수료증 다운로드 기능 구현
    alert(`${courseName} 수료증 다운로드 기능은 추후 구현 예정입니다.`);
  };

  if (isLoading && courses.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </PageLayout>
    );
  }

  const recentCourse = getRecentCourse();
  const stats = {
    enrolled: courses.filter(c => c.enrollmentStatus === 'ENROLLED').length,
    completed: courses.filter(c => c.enrollmentStatus === 'COMPLETED').length,
    total: courses.filter(c => c.enrollmentStatus !== 'CANCELLED').length
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">내 강의실</h1>
            <p className="text-gray-600">안녕하세요, {user?.name}님! 오늘도 열심히 학습해보세요.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">수강 중</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.enrolled}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">완강</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">전체 강의</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          {recentCourse && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">▶️</span>
                <h2 className="text-2xl font-bold">이어듣기</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-32 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🎬</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{recentCourse.courseTitle}</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1 bg-white/30 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all"
                        style={{ width: `${recentCourse.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{recentCourse.progressPercentage}%</span>
                  </div>
                  <button
                    onClick={() => handleEnterCourse(recentCourse.id)}
                    className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    이어서 학습하기 →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'ALL' as TabType, label: '전체', count: stats.total },
              { key: 'ENROLLED' as TabType, label: '학습 중', count: stats.enrolled },
              { key: 'COMPLETED' as TabType, label: '완강', count: stats.completed }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Course Cards */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-500 text-lg mb-2">수강 중인 강의가 없습니다</p>
              <p className="text-gray-400 text-sm">새로운 강의를 수강해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                const progressPercentage = course.enrollmentStatus === 'COMPLETED' ? 100 : course.progressPercentage;
                const isCompleted = course.enrollmentStatus === 'COMPLETED';

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative">
                      <span className="text-6xl">🎓</span>
                      {isCompleted && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          완강 🎉
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {course.courseTitle}
                      </h3>

                      <p className="text-sm text-gray-500 mb-4">
                        차수 {course.termNumber}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">진도율</span>
                          <span className="text-sm font-bold text-gray-900">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${getProgressColor(progressPercentage)} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEnterCourse(course.id)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                          {isCompleted ? '다시보기' : '학습하기'}
                        </button>
                        {isCompleted && (
                          <button
                            onClick={() => handleDownloadCertificate(course.courseTitle)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                          >
                            수료증
                          </button>
                        )}
                      </div>

                      {/* Enrollment Date */}
                      <p className="text-xs text-gray-400 mt-3">
                        수강 시작일: {new Date(course.enrollmentCreatedAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
