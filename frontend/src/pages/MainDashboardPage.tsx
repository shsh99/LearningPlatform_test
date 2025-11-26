import { useState } from 'react';
import { Navbar } from '../components/Navbar';

// 통계 카드 데이터 타입
interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

// 최근 강의 데이터 타입
interface RecentCourse {
  id: string;
  title: string;
  updatedAt: string;
  instructor: string;
  status: 'Active' | 'Draft' | 'Archived';
  price: string;
  students: number;
}

// 신규 가입 유저 타입
interface NewUser {
  id: string;
  name: string;
  joinedAt: string;
  role: string;
}

export const MainDashboardPage = () => {
  const [revenueTab, setRevenueTab] = useState<'revenue' | 'traffic'>('revenue');
  const [userTab, setUserTab] = useState<'newUsers' | 'activity'>('newUsers');

  // 더미 데이터
  const statCards: StatCard[] = [
    {
      title: '총 매출',
      value: '₩45,231,890',
      change: '+20.1%',
      changeType: 'positive',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '신규 수강생',
      value: '+2,350',
      change: '+180.1%',
      changeType: 'positive',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: '활성 강의',
      value: '1,203',
      change: '-4.5%',
      changeType: 'negative',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: '수료율',
      value: '57.3%',
      change: '+12.5%',
      changeType: 'positive',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ];

  const recentCourses: RecentCourse[] = [
    { id: 'CID-1234', title: 'React 완벽 가이드 2025', updatedAt: '2025-01-15', instructor: '김민수', status: 'Active', price: '₩89,000', students: 320 },
    { id: 'CID-1235', title: 'UX/UI 디자인 실무', updatedAt: '2025-01-14', instructor: '이영희', status: 'Draft', price: '₩75,000', students: 0 },
    { id: 'CID-1236', title: '파이썬 데이터 분석', updatedAt: '2025-01-12', instructor: '박지성', status: 'Active', price: '₩110,000', students: 850 },
    { id: 'CID-1237', title: 'AWS 클라우드 마스터', updatedAt: '2025-01-10', instructor: '최준영', status: 'Active', price: '₩150,000', students: 420 },
  ];

  const newUsers: NewUser[] = [
    { id: '1', name: 'User_1234', joinedAt: '방금 전 가입', role: '일반 회원' },
    { id: '2', name: 'User_2234', joinedAt: '방금 전 가입', role: '일반 회원' },
    { id: '3', name: 'User_3234', joinedAt: '방금 전 가입', role: '일반 회원' },
    { id: '4', name: 'User_4234', joinedAt: '방금 전 가입', role: '일반 회원' },
  ];

  const getStatusBadge = (status: RecentCourse['status']) => {
    const styles = {
      Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Draft: 'bg-amber-50 text-amber-700 border-amber-200',
      Archived: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="mt-2 text-gray-600">전체 플랫폼의 현황과 주요 지표를 한눈에 확인하세요.</p>
          </div>

          {/* 데이터 분석 섹션 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">데이터 분석</h2>

            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{card.title}</span>
                    {card.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      {card.changeType === 'positive' ? (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      <span className={card.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}>
                        {card.change}
                      </span>
                      <span className="text-gray-500">지난달 대비</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 차트 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 수익 및 트래픽 현황 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">수익 및 트래픽 현황</h3>
                  <p className="text-sm text-gray-500 mt-1">최근 7개월간의 데이터 추이입니다.</p>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setRevenueTab('revenue')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      revenueTab === 'revenue'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    매출 (Revenue)
                  </button>
                  <button
                    onClick={() => setRevenueTab('traffic')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      revenueTab === 'traffic'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    트래픽 (Traffic)
                  </button>
                </div>
              </div>

              {/* 차트 영역 (플레이스홀더) */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm text-gray-500">
                    {revenueTab === 'revenue' ? '매출 차트' : '트래픽 차트'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1월 ~ 7월 데이터</p>
                </div>
              </div>
            </div>

            {/* 유저 및 수강생 현황 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">유저 및 수강생 현황</h3>
                <p className="text-sm text-gray-500 mt-1">신규 가입자 및 수강생 활동 내역입니다.</p>
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setUserTab('newUsers')}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    userTab === 'newUsers'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  신규 가입
                </button>
                <button
                  onClick={() => setUserTab('activity')}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    userTab === 'activity'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  수강생 활동
                </button>
              </div>

              <div className="space-y-3">
                {newUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.joinedAt}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-[#6600FF]/10 text-[#6600FF] rounded">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 강의 관리 섹션 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">강의 관리</h2>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* 카드 헤더 */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">최근 등록된 강의</h3>
                    <p className="text-sm text-gray-500 mt-1">최근 생성되거나 업데이트된 강의 목록입니다.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      엑셀 다운로드
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#6600FF] text-white rounded-lg text-sm font-medium hover:bg-[#5500DD] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      강의 개설
                    </button>
                  </div>
                </div>
              </div>

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        강의 ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        강의명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        강사
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        가격
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        수강생
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">

                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.id}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{course.title}</p>
                            <p className="text-xs text-gray-500">Updated: {course.updatedAt}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-900">{course.instructor}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(course.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {course.students.toLocaleString()}명
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
