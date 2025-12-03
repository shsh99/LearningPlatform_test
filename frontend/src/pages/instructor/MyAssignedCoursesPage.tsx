import { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { AssignedCoursesTab } from '../../components/instructor/AssignedCoursesTab';
import { MyRequestsTab } from '../../components/instructor/MyRequestsTab';

type TabType = 'assigned' | 'requests';

export const MyAssignedCoursesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('assigned');

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-gray-600">로그인이 필요합니다.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageHeader
        title="담당 강의"
        description="배정받은 강의를 관리하고 변경/삭제 요청을 할 수 있습니다."
        backTo="/"
      />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 탭 네비게이션 */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('assigned')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                배정된 강의
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                요청 현황
              </button>
            </nav>
          </div>

          {/* 탭 내용 */}
          {activeTab === 'assigned' && <AssignedCoursesTab userId={user.id} />}
          {activeTab === 'requests' && <MyRequestsTab />}
        </div>
      </div>
    </>
  );
};
