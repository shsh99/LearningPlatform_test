import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../../components/Navbar';
import { getTenantAdminDashboardStats } from '../../api/dashboard';
import { useTenant } from '../../contexts/TenantContext';
import { useLayoutConfigForRole } from '../../hooks/useLayoutConfig';
import type { TenantAdminDashboardStats } from '../../types/dashboard';

export const TenantAdminDashboardPage = () => {
  const { branding } = useTenant();
  const { dashboardWidgets, isWidgetEnabled } = useLayoutConfigForRole('tenantAdmin');
  const [stats, setStats] = useState<TenantAdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 위젯 컴포넌트 매핑
  const widgetComponents: Record<string, React.ReactNode> = useMemo(() => {
    if (!stats) return {};

    return {
      tenantStats: <TenantStatsWidget key="tenantStats" stats={stats} branding={branding} />,
      userManagement: <UserManagementWidget key="userManagement" stats={stats} />,
      courseOverview: <CourseOverviewWidget key="courseOverview" stats={stats} branding={branding} />,
    };
  }, [stats, branding]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTenantAdminDashboardStats();
      setStats(data);
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatUsageTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      INACTIVE: 'bg-gray-50 text-gray-700 border-gray-200',
      SUSPENDED: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    const labels: Record<string, string> = {
      ACTIVE: '활성',
      INACTIVE: '비활성',
      SUSPENDED: '정지',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badges[status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
        {labels[status] || status}
      </span>
    );
  };

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
                  <svg className="w-8 h-8" style={{ color: branding.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  테넌트 관리자 대시보드
                </h1>
                <p className="mt-1 text-sm text-gray-600">테넌트 현황 및 통계를 확인하세요</p>
              </div>
              <button
                onClick={fetchDashboardStats}
                className="px-4 py-2 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
                style={{ backgroundColor: branding.primaryColor }}
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
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-rose-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: branding.primaryColor }}></div>
              <p className="mt-4 text-gray-600">대시보드 데이터를 불러오는 중...</p>
            </div>
          ) : stats ? (
            <div className="space-y-8">
              {/* 테넌트 정보 카드 (항상 표시) */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{stats.tenantInfo.tenantName}</h2>
                    <p className="text-sm text-gray-500 mt-1">코드: {stats.tenantInfo.tenantCode}</p>
                  </div>
                  {getStatusBadge(stats.tenantInfo.status)}
                </div>
              </div>

              {/* 위젯 순서대로 렌더링 */}
              {dashboardWidgets.map((widget) => (
                <div key={widget.id}>
                  {widgetComponents[widget.id]}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 text-gray-500 text-lg font-medium">대시보드 데이터를 불러올 수 없습니다</p>
              <button
                onClick={fetchDashboardStats}
                className="mt-4 px-4 py-2 text-white rounded-lg transition"
                style={{ backgroundColor: branding.primaryColor }}
              >
                다시 시도
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * 테넌트 통계 위젯 (통계 카드)
 */
interface TenantStatsWidgetProps {
  stats: TenantAdminDashboardStats;
  branding: { primaryColor: string };
}

function TenantStatsWidget({ stats }: TenantStatsWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">통계</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 총 유저 수 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 유저 수</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.stats.userCount}</p>
              <p className="text-xs text-gray-500 mt-1">운영자: {stats.stats.operatorCount}명</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 총 강의 수 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 강의 수</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.stats.courseCount}</p>
              <p className="text-xs text-gray-500 mt-1">차수: {stats.stats.termCount}개</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* 평균 평점 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">평균 평점</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-3xl font-bold text-amber-600">{stats.stats.averageRating.toFixed(1)}</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(stats.stats.averageRating) ? 'text-amber-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 사용자 관리 위젯
 */
interface UserManagementWidgetProps {
  stats: TenantAdminDashboardStats;
}

function UserManagementWidget({ stats }: UserManagementWidgetProps) {
  const formatUsageTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">사용자 관리</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">활성 사용자</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.stats.userCount}</p>
            <p className="text-sm text-gray-500 mt-1">운영자 {stats.stats.operatorCount}명 포함</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">총 사용 시간</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{formatUsageTime(stats.stats.usageMinutes)}</p>
            <p className="text-sm text-gray-500 mt-1">전체 사용자 누적</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 코스 개요 위젯
 */
interface CourseOverviewWidgetProps {
  stats: TenantAdminDashboardStats;
  branding: { primaryColor: string };
}

function CourseOverviewWidget({ stats, branding }: CourseOverviewWidgetProps) {
  const formatUsageTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">코스 개요</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">총 사용 시간</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{formatUsageTime(stats.stats.usageMinutes)}</p>
            <p className="text-sm text-gray-500 mt-2">전체 사용자의 누적 학습 시간</p>
          </div>
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* 사용량 바 */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>이번 달 목표 대비</span>
            <span className="font-medium">{Math.min(100, Math.round(stats.stats.usageMinutes / 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round(stats.stats.usageMinutes / 100))}%`,
                backgroundColor: branding.primaryColor
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
