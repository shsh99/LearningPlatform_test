import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { isDarkTheme } from '../utils/theme';
import { getFullFileUrl } from '../api/file';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { branding, labels, buildPath, tenantCode } = useTenant();

    // 브랜딩 헤더 색상 기반 다크 테마 자동 감지
    const isThemeDark = isDarkTheme(branding.headerBgColor);

    const handleLogout = () => {
        logout();
        // 로그아웃 시 항상 기본 로그인 페이지로 (테넌트 테마 없는 상태)
        window.location.href = '/login';
    };

    // 역할별 변수
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isTenantAdmin = user?.role === 'TENANT_ADMIN';
    const isOperator = user?.role === 'OPERATOR' || user?.role === 'ADMIN';

    return (
        <nav
            className="border-b sticky top-0 z-50 shadow-sm"
            style={{
                backgroundColor: branding.headerBgColor,
                color: branding.headerTextColor,
                borderColor: branding.secondaryColor + '30',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* 로고 */}
                    <div className="flex items-center">
                        <Link to={buildPath('/')} className="flex items-center gap-2 group">
                            {branding.logoUrl ? (
                                <img
                                    src={getFullFileUrl(branding.logoUrl) || ''}
                                    alt={labels.platformName}
                                    className="w-10 h-10 rounded-lg object-contain group-hover:shadow-lg transition-shadow"
                                />
                            ) : (
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow ${isThemeDark ? 'shadow-lg shadow-emerald-500/20' : ''}`}
                                    style={{ backgroundColor: branding.primaryColor }}
                                >
                                    <svg className={`w-6 h-6 ${isThemeDark ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            )}
                            <span className="text-xl font-bold" style={{ color: branding.headerTextColor }}>
                                {labels.platformName}
                            </span>
                        </Link>

                        {/* 테넌트 코드 표시 (개발용) */}
                        {tenantCode && (
                            <span className="ml-3 px-2 py-1 text-xs rounded-full bg-white/10" style={{ color: branding.headerTextColor }}>
                                {tenantCode}
                            </span>
                        )}
                    </div>

                    {/* 메뉴 */}
                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                {/* 강의 탐색 - SUPER_ADMIN, TENANT_ADMIN 제외 */}
                                {!isSuperAdmin && !isTenantAdmin && (
                                    <Link
                                        to={buildPath('/courses')}
                                        className="font-medium transition-colors hover:opacity-80"
                                        style={{ color: branding.headerTextColor }}
                                    >
                                        {labels.courseLabel} 탐색
                                    </Link>
                                )}

                                {user?.role === 'USER' && (
                                    <>
                                        <Link
                                            to={buildPath('/my-learning')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            내 {labels.courseLabel}실
                                        </Link>
                                        <Link
                                            to={buildPath('/my-applications')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            {labels.applicationLabel} 현황
                                        </Link>
                                        <Link
                                            to={buildPath('/my-profile')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            마이페이지
                                        </Link>
                                        <Link
                                            to={buildPath('/apply-course')}
                                            className="px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
                                            style={{
                                                backgroundColor: branding.buttonPrimaryBgColor,
                                                color: branding.buttonPrimaryTextColor,
                                            }}
                                        >
                                            {labels.courseLabel} 개설 {labels.applicationLabel}
                                        </Link>
                                    </>
                                )}

                                {user?.role === 'TENANT_ADMIN' && (
                                    <>
                                        <Link
                                            to={buildPath('/tenant-admin/branding')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            브랜딩 설정
                                        </Link>
                                        <Link
                                            to={buildPath('/tenant-admin/operators')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            오퍼레이터 관리
                                        </Link>
                                    </>
                                )}

                                {/* SUPER_ADMIN 메뉴 - 절대 경로 사용 */}
                                {isSuperAdmin && (
                                    <>
                                        <Link
                                            to="/super-admin/applications"
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            신청 관리
                                        </Link>
                                        <Link
                                            to="/super-admin/tenants"
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            테넌트 관리
                                        </Link>
                                        <Link
                                            to="/super-admin/create-tenant-admin"
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            테넌트 어드민 생성
                                        </Link>
                                    </>
                                )}

                                {/* OPERATOR/ADMIN 전용 메뉴 - SUPER_ADMIN 제외 */}
                                {isOperator && (
                                    <>
                                        <Link
                                            to={buildPath('/operator/dashboard')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            {labels.dashboardLabel}
                                        </Link>
                                        <Link
                                            to={buildPath('/operator/terms')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            {labels.termLabel} 관리
                                        </Link>
                                        <Link
                                            to={buildPath('/operator/assignments')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            {labels.instructorLabel} 배정
                                        </Link>
                                        <Link
                                            to={buildPath('/ts/iis')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            IIS 조회
                                        </Link>
                                        <Link
                                            to={buildPath('/enrollment/sis')}
                                            className="font-medium transition-colors hover:opacity-80"
                                            style={{ color: branding.headerTextColor }}
                                        >
                                            SIS 조회
                                        </Link>
                                    </>
                                )}

                                {/* 사용자 메뉴 */}
                                <div
                                    className="flex items-center gap-3 pl-4 border-l"
                                    style={{ borderColor: branding.headerTextColor + '30' }}
                                >
                                    <div className="text-right">
                                        <div className="text-sm font-medium" style={{ color: branding.headerTextColor }}>
                                            {user?.name}
                                        </div>
                                        <div className="text-xs opacity-70" style={{ color: branding.headerTextColor }}>
                                            {user?.email}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 transition-colors hover:opacity-70"
                                        style={{ color: branding.headerTextColor }}
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
                                    to={buildPath('/login')}
                                    className="font-medium transition-colors hover:opacity-80"
                                    style={{ color: branding.headerTextColor }}
                                >
                                    로그인
                                </Link>
                                <Link
                                    to={buildPath('/signup')}
                                    className="px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
                                    style={{
                                        backgroundColor: branding.buttonPrimaryBgColor,
                                        color: branding.buttonPrimaryTextColor,
                                    }}
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
