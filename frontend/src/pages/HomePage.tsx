import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useTenant } from '../contexts/TenantContext';
import { isDarkTheme, getThemeClass, getGlowOrbClasses } from '../utils/theme';

export function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const { branding, labels, navigate, buildPath, tenantCode } = useTenant();
    const routerNavigate = useNavigate();

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isTenantAdmin = user?.role === 'TENANT_ADMIN';
    const isOperator = user?.role === 'OPERATOR' || user?.role === 'ADMIN';
    const isAdmin = user?.role === 'ADMIN' || isSuperAdmin;

    // 역할별 대시보드로 리다이렉트
    useEffect(() => {
        if (isAuthenticated && user) {
            if (isSuperAdmin) {
                routerNavigate('/super-admin/dashboard', { replace: true });
            } else if (isTenantAdmin && tenantCode) {
                routerNavigate(`/${tenantCode}/tenant-admin/dashboard`, { replace: true });
            } else if (isOperator && tenantCode) {
                routerNavigate(`/${tenantCode}/operator/dashboard`, { replace: true });
            }
            // USER는 현재 페이지에 남음
        }
    }, [isAuthenticated, user, isSuperAdmin, isTenantAdmin, isOperator, tenantCode, routerNavigate]);

    // 브랜딩 헤더 색상 기반 다크 테마 자동 감지
    const isThemeDark = isDarkTheme(branding.headerBgColor);

    // 테마별 배경 클래스 가져오기
    const themeClass = getThemeClass(branding.primaryColor, branding.headerBgColor, branding.backgroundColor);
    const glowOrbs = getGlowOrbClasses(branding.primaryColor, branding.headerBgColor, branding.backgroundColor);

    // 커스텀 배경색이 있거나 테마가 있는 경우
    const hasCustomBackground = branding.backgroundColor && branding.backgroundColor.trim() !== '';
    const hasThemeBackground = themeClass !== '' && themeClass !== 'bg-gray-50';

    if (!isAuthenticated) {
        // 테마별 랜딩 페이지
        if (hasCustomBackground || hasThemeBackground) {
            return (
                <>
                    <Navbar />
                    <div
                        className={`min-h-screen ${hasCustomBackground ? '' : themeClass}`}
                        style={hasCustomBackground ? { backgroundColor: branding.backgroundColor } : undefined}
                    >
                        {/* 배경 효과 */}
                        {isThemeDark && <div className="star-field"></div>}
                        {glowOrbs.primary && <div className={`glow-orb ${glowOrbs.primary} w-96 h-96 top-20 -left-48`}></div>}
                        {glowOrbs.secondary && <div className={`glow-orb ${glowOrbs.secondary} w-80 h-80 top-40 -right-40 animation-delay-2000`}></div>}
                        {isThemeDark && <div className="glow-orb glow-orb-blue w-72 h-72 bottom-20 left-1/3 animation-delay-4000"></div>}

                        {/* Hero Section */}
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                            <div className="text-center">
                                <p className="text-gray-400 text-lg mb-4 fade-in-up">
                                    AI-Powered Learning Platform
                                </p>
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 fade-in-up fade-in-up-delay-1">
                                    Empower Your
                                    <span className="block text-gradient-megazone mt-2">
                                        {labels.platformName}
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto fade-in-up fade-in-up-delay-2">
                                    전문가가 운영하는 프리미엄 {labels.courseLabel}로<br className="hidden md:block" />
                                    당신의 성장을 가속화하세요
                                </p>
                                <div className="flex gap-6 justify-center fade-in-up fade-in-up-delay-3">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="btn-neon"
                                    >
                                        시작하기
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="btn-gradient-border"
                                    >
                                        회원가입
                                    </button>
                                </div>

                                {/* 기업 계정 신청 안내 */}
                                <div className="mt-8 fade-in-up fade-in-up-delay-4">
                                    <div className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-xl hover:bg-white/10 transition-all cursor-pointer" onClick={() => window.location.href = '/apply-tenant'}>
                                        <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="font-semibold text-white text-sm">기업 계정 신청</div>
                                            <div className="text-xs text-gray-300">회사에서 플랫폼을 사용하시려면 여기서 신청하세요</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Section - 다크 버전 */}
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Why Choose <span className="text-gradient-purple">{labels.platformName}</span>?
                                </h2>
                                <p className="text-gray-400 text-lg">혁신적인 학습 경험을 제공합니다</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="glass-card p-8 card-hover-glow fade-in-up">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#70f2a0] to-[#6778ff] flex items-center justify-center mb-6">
                                        <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">프리미엄 {labels.courseLabel}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        업계 최고 전문가들이 직접 설계한 고품질 커리큘럼을 경험하세요
                                    </p>
                                </div>

                                <div className="glass-card p-8 card-hover-glow fade-in-up fade-in-up-delay-1">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6778ff] to-[#6bc2f0] flex items-center justify-center mb-6">
                                        <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">검증된 {labels.instructorLabel}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        엄격한 심사를 통과한 전문 {labels.instructorLabel}진의 1:1 멘토링
                                    </p>
                                </div>

                                <div className="glass-card p-8 card-hover-glow fade-in-up fade-in-up-delay-2">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#dc83ec] to-[#a382ff] flex items-center justify-center mb-6">
                                        <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">실시간 성장 트래킹</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        AI 기반 분석으로 학습 진도와 성과를 한눈에 확인
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="relative z-10 py-24">
                            <div className="max-w-4xl mx-auto px-4 text-center">
                                <div className="glass-card p-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                        지금 바로 시작하세요
                                    </h2>
                                    <p className="text-gray-400 text-lg mb-8">
                                        수천 명의 학습자가 이미 {labels.platformName}과 함께 성장하고 있습니다
                                    </p>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="btn-neon text-lg"
                                    >
                                        무료로 시작하기 →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        // 라이트 테마 (기본) 랜딩 페이지
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                    성장을 위한 학습의 시작
                                    <span
                                        className="block mt-2"
                                        style={{ color: branding.primaryColor }}
                                    >
                                        {labels.platformName}
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                    전문가가 운영하는 고품질 {labels.courseLabel}로 당신의 미래를 설계하세요
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-8 py-4 rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
                                        style={{
                                            backgroundColor: branding.buttonPrimaryBgColor,
                                            color: branding.buttonPrimaryTextColor,
                                        }}
                                    >
                                        시작하기
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="px-8 py-4 bg-white border-2 rounded-xl hover:opacity-80 transition-all font-semibold text-lg"
                                        style={{
                                            color: branding.primaryColor,
                                            borderColor: branding.primaryColor,
                                        }}
                                    >
                                        회원가입
                                    </button>
                                </div>

                                {/* 기업 계정 신청 안내 */}
                                <div className="mt-8">
                                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all cursor-pointer" onClick={() => window.location.href = '/apply-tenant'}>
                                        <svg className="w-6 h-6" style={{ color: branding.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">기업 계정 신청 (플랫폼 도입)</div>
                                            <div className="text-xs text-gray-500">회사에서 플랫폼을 사용하시려면 여기서 신청하세요</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 배경 장식 */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                            <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: branding.primaryColor + '20' }}
                                >
                                    <svg className="w-6 h-6" style={{ color: branding.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">다양한 {labels.courseLabel}</h3>
                                <p className="text-gray-600">전문가가 제공하는 고품질 {labels.courseLabel}를 만나보세요</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: branding.accentColor + '20' }}
                                >
                                    <svg className="w-6 h-6" style={{ color: branding.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">검증된 {labels.instructorLabel}</h3>
                                <p className="text-gray-600">운영자의 엄격한 심사를 통과한 전문 {labels.instructorLabel}진</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: branding.secondaryColor + '20' }}
                                >
                                    <svg className="w-6 h-6" style={{ color: branding.secondaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">빠른 성장</h3>
                                <p className="text-gray-600">체계적인 커리큘럼으로 빠르게 성장하세요</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div
                className={`min-h-screen relative ${hasCustomBackground ? '' : themeClass}`}
                style={hasCustomBackground ? { backgroundColor: branding.backgroundColor } : undefined}
            >
                {/* 테마별 배경 효과 */}
                {isThemeDark && <div className="star-field"></div>}
                {glowOrbs.primary && <div className={`glow-orb ${glowOrbs.primary} w-96 h-96 top-20 -left-48 opacity-30`}></div>}
                {glowOrbs.secondary && <div className={`glow-orb ${glowOrbs.secondary} w-80 h-80 bottom-20 -right-40 opacity-30 animation-delay-2000`}></div>}

                {/* 추천 강의 섹션 */}
                <div
                    className={`py-16 relative z-10 ${isThemeDark ? 'text-white' : 'text-white'}`}
                    style={{ backgroundColor: isThemeDark ? 'transparent' : branding.primaryColor }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold mb-4">지금 시작하세요!</h2>
                        <p className="text-lg mb-8 opacity-80">다양한 {labels.courseLabel}를 탐색하고 나만의 학습 여정을 시작하세요</p>
                        <div className="flex gap-4">
                            <Link
                                to={buildPath('/courses')}
                                className="px-6 py-3 bg-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                style={{ color: branding.primaryColor }}
                            >
                                {labels.courseLabel} 탐색하기
                            </Link>
                            <Link
                                to={buildPath('/apply-course')}
                                className="px-6 py-3 border-2 border-white rounded-lg hover:opacity-80 transition-all font-semibold text-white"
                            >
                                {labels.courseLabel} 개설 {labels.applicationLabel}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 빠른 링크 그리드 */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <h2 className={`text-2xl font-bold mb-6 ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>빠른 이동</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link
                            to={buildPath('/courses')}
                            className={`p-6 rounded-xl transition-all group ${isThemeDark ? 'glass-card card-hover-glow' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: branding.primaryColor + '20' }}
                                >
                                    <svg className="w-6 h-6" style={{ color: branding.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>{labels.courseLabel} 탐색</h3>
                                    <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>다양한 {labels.courseLabel} 보기</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to={buildPath('/my-enrollments')}
                            className={`p-6 rounded-xl transition-all group ${isThemeDark ? 'glass-card card-hover-glow' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>내 {labels.courseLabel}</h3>
                                    <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>수강 중인 {labels.courseLabel}</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to={buildPath('/my-applications')}
                            className={`p-6 rounded-xl transition-all group ${isThemeDark ? 'glass-card card-hover-glow' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>{labels.applicationLabel} 현황</h3>
                                    <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>개설 {labels.applicationLabel} 내역</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to={buildPath('/apply-course')}
                            className="p-6 rounded-xl shadow-sm hover:shadow-md transition-all group"
                            style={{ backgroundColor: branding.buttonPrimaryBgColor }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" style={{ color: branding.buttonPrimaryTextColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: branding.buttonPrimaryTextColor }}>{labels.courseLabel} 개설</h3>
                                    <p className="text-sm opacity-80" style={{ color: branding.buttonPrimaryTextColor }}>새 {labels.courseLabel} 신청하기</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 관리자 메뉴 (SUPER_ADMIN 또는 ADMIN만 표시) */}
                {isAdmin && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
                        <h2 className={`text-2xl font-bold mb-6 ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>관리자 메뉴</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link
                                to={buildPath('/tenant-admin/branding')}
                                className={`p-6 rounded-xl transition-all group ${isThemeDark ? 'glass-card card-hover-glow' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>브랜딩 설정</h3>
                                        <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>색상, 로고, 라벨 관리</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to={buildPath('/operator/dashboard')}
                                className={`p-6 rounded-xl transition-all group ${isThemeDark ? 'glass-card card-hover-glow' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>운영자 대시보드</h3>
                                        <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>통계 및 현황 확인</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to={buildPath('/operator/terms')}
                                className={`p-6 rounded-xl transition-all group ${isThemeDark ? 'glass-card card-hover-glow' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>차수 관리</h3>
                                        <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>강의 차수 관리</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to={buildPath('/operator/assignments')}
                                className={`p-6 rounded-xl transition-all group ${isThemeDark ? 'glass-card card-hover-glow' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>강사 배정</h3>
                                        <p className={`text-sm ${isThemeDark ? 'text-gray-400' : 'text-gray-500'}`}>강사 배정 관리</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
