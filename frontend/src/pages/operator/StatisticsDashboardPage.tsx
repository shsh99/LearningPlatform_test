import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { getDashboardStatistics } from '../../api/dashboard';
import type {
  DashboardStatisticsResponse,
  TermStatistics,
} from '../../types/dashboard';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const SCHEDULE_TYPE_KR: Record<string, { label: string; color: string }> = {
  REGULAR: { label: '정규', color: 'bg-blue-100 text-blue-800' },
  CANCELLED: { label: '휴강', color: 'bg-red-100 text-red-800' },
  MAKEUP: { label: '보강', color: 'bg-green-100 text-green-800' },
};

const TERM_STATUS_KR: Record<string, { label: string; color: string }> = {
  SCHEDULED: { label: '예정', color: 'bg-gray-100 text-gray-800' },
  ONGOING: { label: '진행중', color: 'bg-green-100 text-green-800' },
  COMPLETED: { label: '완료', color: 'bg-blue-100 text-blue-800' },
  CANCELLED: { label: '취소', color: 'bg-red-100 text-red-800' },
};

export default function StatisticsDashboardPage() {
  const [statistics, setStatistics] = useState<DashboardStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStatistics();
      setStatistics(data);
    } catch (err) {
      setError('통계를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error || !statistics) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error || '데이터를 불러올 수 없습니다.'}
          </div>
        </div>
      </>
    );
  }

  const { overall, todaySchedules, weeklySchedules, termStatistics } = statistics;

  const weeklyData = [
    weeklySchedules.mondayCount,
    weeklySchedules.tuesdayCount,
    weeklySchedules.wednesdayCount,
    weeklySchedules.thursdayCount,
    weeklySchedules.fridayCount,
    weeklySchedules.saturdayCount,
    weeklySchedules.sundayCount,
  ];
  const maxWeekly = Math.max(...weeklyData, 1);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        {/* 페이지 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  통계 대시보드
                </h1>
                <p className="mt-1 text-sm text-gray-600">전체 현황 및 일정 통계를 확인하세요</p>
              </div>
              <button
                onClick={fetchStatistics}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                새로고침
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 전체 현황 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <StatCard label="전체 강의" value={overall.totalCourses} color="blue" icon="book" />
            <StatCard label="전체 차수" value={overall.totalTerms} color="indigo" icon="calendar" />
            <StatCard label="진행중 차수" value={overall.activeTerms} color="green" icon="play" />
            <StatCard label="총 수강생" value={overall.totalStudents} color="purple" icon="users" />
            <StatCard label="배정된 강사" value={overall.totalInstructors} color="amber" icon="user" />
            <StatCard label="전체 강의실" value={overall.totalClassRooms} color="cyan" icon="building" />
            <StatCard label="사용가능 강의실" value={overall.availableClassRooms} color="emerald" icon="check" />
          </div>

          {/* 오늘의 일정 & 주간 요약 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 오늘의 일정 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                오늘의 일정 ({todaySchedules.date})
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{todaySchedules.totalClasses}</p>
                  <p className="text-xs text-gray-600">전체</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{todaySchedules.cancelledClasses}</p>
                  <p className="text-xs text-gray-600">휴강</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{todaySchedules.makeupClasses}</p>
                  <p className="text-xs text-gray-600">보강</p>
                </div>
              </div>

              {todaySchedules.schedules.length === 0 ? (
                <p className="text-center text-gray-500 py-4">오늘 예정된 일정이 없습니다.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {todaySchedules.schedules.map((schedule) => (
                    <div
                      key={schedule.scheduleId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{schedule.courseName}</p>
                        <p className="text-sm text-gray-500">
                          {schedule.startTime} - {schedule.endTime}
                          {schedule.classRoomName && ` | ${schedule.classRoomName}`}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          SCHEDULE_TYPE_KR[schedule.scheduleType]?.color || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {SCHEDULE_TYPE_KR[schedule.scheduleType]?.label || schedule.scheduleType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 주간 요약 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                이번 주 일정 요약
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {weeklySchedules.weekStart} ~ {weeklySchedules.weekEnd}
              </p>

              <div className="flex items-end justify-between h-40 gap-2">
                {weeklyData.map((count, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                      style={{ height: `${(count / maxWeekly) * 100}%`, minHeight: count > 0 ? '8px' : '0' }}
                    ></div>
                    <span className="text-xs font-medium text-gray-600 mt-2">{DAY_LABELS[index]}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">주간 총 일정</span>
                  <span className="text-lg font-bold text-gray-900">{weeklySchedules.totalCount}건</span>
                </div>
              </div>
            </div>
          </div>

          {/* 차수별 현황 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              차수별 현황
            </h2>

            {termStatistics.length === 0 ? (
              <p className="text-center text-gray-500 py-8">표시할 차수가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">강의명</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">차수</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">수강생</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">진행률</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {termStatistics.map((term: TermStatistics) => (
                      <tr key={term.termId} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {term.courseName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {term.termNumber}기
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              TERM_STATUS_KR[term.status]?.color || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {TERM_STATUS_KR[term.status]?.label || term.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {term.startDate} ~ {term.endDate}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {term.currentStudents} / {term.maxStudents}명
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${term.progressPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12">{term.progressPercent}%</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {term.completedSchedules}/{term.totalSchedules}회 완료
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// 통계 카드 컴포넌트
function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-2`}>
        <IconComponent icon={icon} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function IconComponent({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    book: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    play: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    building: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    check: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return icons[icon] || null;
}
