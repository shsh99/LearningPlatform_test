import { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { useLayout } from '../hooks/useLayout';
import { useBanner } from '../hooks/useBanner';
import { LayoutBanner } from './layout/LayoutBanner';
import { isDarkTheme } from '../utils/theme';
import { getFullFileUrl } from '../api/file';
import { getActiveTenants } from '../api/tenant';
import type { Tenant } from '../types/tenant';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { branding, labels, buildPath, tenantCode } = useTenant();
    const { menuItems } = useLayout();
    const { hasTopBanner } = useBanner();
    const navigate = useNavigate();

    // SUPER_ADMIN 테넌트 선택 상태
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [showTenantDropdown, setShowTenantDropdown] = useState(false);
    const [selectedTenantCode, setSelectedTenantCode] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 브랜딩 헤더 색상 기반 다크 테마 자동 감지
    const isThemeDark = isDarkTheme(branding.headerBgColor);

    // 역할별 변수
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    // SUPER_ADMIN인 경우 테넌트 목록 로드
    useEffect(() => {
        if (isSuperAdmin) {
            getActiveTenants()
                .then(setTenants)
                .catch(err => console.error('Failed to load tenants:', err));
        }
    }, [isSuperAdmin]);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowTenantDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTenantSelect = (tenant: Tenant) => {
        setSelectedTenantCode(tenant.code);
        setShowTenantDropdown(false);
        // 선택한 테넌트의 URL로 이동
        navigate(`/${tenant.code}/`);
    };

    const handleLogout = () => {
        logout();
        // 로그아웃 시 항상 기본 로그인 페이지로 (테넌트 테마 없는 상태)
        window.location.href = '/login';
    };

    // 메뉴 아이템 경로 생성 (SUPER_ADMIN은 절대 경로, 그 외는 buildPath 사용)
    const getMenuPath = (path: string) => {
        if (isSuperAdmin && path.startsWith('/super-admin')) {
            return path;
        }
        return buildPath(path);
    };

    // 아이콘 렌더링
    const renderIcon = (iconName?: string) => {
        switch (iconName) {
            case 'dashboard':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                );
            case 'book':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                );
            case 'calendar':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'people':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            case 'school':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                );
            case 'assignment':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                );
            case 'palette':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                );
            case 'settings':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'person':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'layout':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <Fragment>
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
                                {/* SUPER_ADMIN 테넌트 선택 드롭다운 */}
                                {isSuperAdmin && (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                                            style={{
                                                backgroundColor: branding.primaryColor + '20',
                                                color: branding.headerTextColor,
                                            }}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span>{selectedTenantCode || tenantCode || '테넌트 선택'}</span>
                                            <svg className={`w-4 h-4 transition-transform ${showTenantDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {showTenantDropdown && tenants.length > 0 && (
                                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                                                    테넌트 전환
                                                </div>
                                                {tenants.map(tenant => (
                                                    <button
                                                        key={tenant.id}
                                                        onClick={() => handleTenantSelect(tenant)}
                                                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                                                            (selectedTenantCode || tenantCode) === tenant.code ? 'bg-indigo-50' : ''
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="font-medium text-gray-900">{tenant.name}</div>
                                                            <div className="text-xs text-gray-500">{tenant.code}</div>
                                                        </div>
                                                        {(selectedTenantCode || tenantCode) === tenant.code && (
                                                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 동적 메뉴 아이템 (레이아웃 설정 기반) */}
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={getMenuPath(item.path || '/')}
                                        className="flex items-center gap-1.5 font-medium transition-colors hover:opacity-80"
                                        style={{ color: branding.headerTextColor }}
                                    >
                                        {item.icon && renderIcon(item.icon)}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}

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

            {/* 상단 배너 (Navbar 바로 다음에 표시) */}
            {hasTopBanner && <LayoutBanner position="top" />}
        </Fragment>
    );
}
