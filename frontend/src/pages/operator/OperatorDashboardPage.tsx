import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../../components/Navbar';
import { getAllUsers } from '../../api/user';
import { getDashboardStats } from '../../api/dashboard';
import {
  StatsCards,
  CourseCalendar,
  TermStatusChart,
  ApplicationStatusChart,
  InstructorStatsTable,
  UserRoleChart,
} from '../../components/dashboard';
import { RequestManagementTab } from '../../components/operator/RequestManagementTab';
import { useTenant } from '../../contexts/TenantContext';
import { useLayoutConfigForRole } from '../../hooks/useLayoutConfig';
import type { User } from '../../api/user';
import type { DashboardStats } from '../../types/dashboard';

type TabType = 'dashboard' | 'requests' | 'users';

export const OperatorDashboardPage = () => {
  const { branding, labels } = useTenant();
  const { dashboardWidgets } = useLayoutConfigForRole('operator');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // 대시보드 통계 state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // 위젯 컴포넌트 매핑
  const widgetComponents: Record<string, React.ReactNode> = useMemo(() => {
    if (!dashboardStats) return {};

    return {
      stats: <StatsCards key="stats" stats={dashboardStats} />,
      termCalendar: (
        <div key="termCalendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TermStatusChart stats={dashboardStats} />
            <ApplicationStatusChart stats={dashboardStats} />
          </div>
          <CourseCalendar terms={dashboardStats.upcomingTerms} />
        </div>
      ),
      instructorStats: (
        <div key="instructorStats" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserRoleChart usersByRole={dashboardStats.usersByRole} />
          <InstructorStatsTable instructorStats={dashboardStats.instructorStats} />
        </div>
      ),
    };
  }, [dashboardStats]);


  // 유저 관련 state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingDashboard(true);
      setError(null);
      const data = await getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('유저 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      USER: 'bg-blue-50 text-blue-700 border-blue-200',
      OPERATOR: 'bg-purple-50 text-purple-700 border-purple-200',
      ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[role as keyof typeof badges] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
        {role}
      </span>
    );
  };

  const filteredUsers = searchEmail
    ? users.filter(user => user.email.toLowerCase().includes(searchEmail.toLowerCase()))
    : users;

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {labels.dashboardLabel}
                </h1>
                <p className="mt-1 text-sm text-gray-600">{labels.courseLabel} 개설 {labels.applicationLabel}을 관리하고 사용자를 조회하세요</p>
              </div>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-transparent text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === 'dashboard' ? { borderColor: branding.primaryColor, color: branding.primaryColor } : {}}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  {labels.dashboardLabel}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'requests'
                    ? 'border-transparent text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === 'requests' ? { borderColor: branding.primaryColor, color: branding.primaryColor } : {}}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  요청 관리
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('users');
                  if (users.length === 0) fetchUsers();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-transparent text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === 'users' ? { borderColor: branding.primaryColor, color: branding.primaryColor } : {}}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  사용자 관리
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-rose-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            {/* 대시보드 탭 */}
            {activeTab === 'dashboard' && (
              <>
                {loadingDashboard ? (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">대시보드 데이터를 불러오는 중...</p>
                  </div>
                ) : dashboardStats ? (
                  <div className="space-y-6">
                    {/* 위젯 순서대로 렌더링 */}
                    {dashboardWidgets.map((widget) => (
                      <div key={widget.id}>
                        {widgetComponents[widget.id]}
                      </div>
                    ))}
                    {/* 위젯이 하나도 없을 경우 기본 메시지 */}
                    {dashboardWidgets.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        표시할 위젯이 없습니다. 레이아웃 설정에서 위젯을 활성화해주세요.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-lg font-medium">대시보드 데이터를 불러올 수 없습니다</p>
                    <button
                      onClick={fetchDashboardStats}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      다시 시도
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 요청 관리 탭 */}
            {activeTab === 'requests' && <RequestManagementTab />}

            {/* 유저 조회 탭 */}
            {activeTab === 'users' && (
              <>
                {/* 검색 */}
                <div className="mb-6 flex gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="이메일로 검색..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <button
                    onClick={fetchUsers}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    새로고침
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-lg font-medium">표시할 사용자가 없습니다</p>
                    <p className="mt-1 text-gray-400 text-sm">검색 조건을 변경하거나 새로고침해보세요</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                ID
                              </th>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                이메일
                              </th>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                이름
                              </th>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                역할
                              </th>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                상태
                              </th>
                              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                가입일
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{user.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {getRoleBadge(user.role)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    user.status === 'ACTIVE'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-gray-50 text-gray-700 border-gray-200'
                                  }`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between px-1">
                      <p className="text-sm text-gray-600">
                        총 <span className="font-semibold text-gray-900">{filteredUsers.length}</span>명의 사용자
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
