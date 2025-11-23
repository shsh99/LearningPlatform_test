import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">EduPlatform</span>
            </Link>
          </div>

          {/* 메뉴 */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/courses"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  강의 탐색
                </Link>

                {user?.role === 'USER' && (
                  <>
                    <Link
                      to="/my-enrollments"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      내 강의
                    </Link>
                    <Link
                      to="/my-applications"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      신청 현황
                    </Link>
                    <Link
                      to="/my-profile"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      마이페이지
                    </Link>
                    <Link
                      to="/apply-course"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      강의 개설 신청
                    </Link>
                  </>
                )}

                {(user?.role === 'OPERATOR' || user?.role === 'ADMIN') && (
                  <>
                    <Link
                      to="/operator/dashboard"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      대시보드
                    </Link>
                    <Link
                      to="/operator/terms"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      차수 관리
                    </Link>
                    <Link
                      to="/operator/assignments"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      강사 배정
                    </Link>
                    <Link
                      to="/ts/iis"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      IIS 조회
                    </Link>
                    <Link
                      to="/enrollment/sis"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      SIS 조회
                    </Link>
                  </>
                )}

                {/* 사용자 메뉴 */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="로그아웃"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
