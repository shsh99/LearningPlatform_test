import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate as useRouterNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { isDarkTheme, getThemeClass, getGlowOrbClasses } from '../utils/theme';

export function LoginPage() {
    const { login } = useAuth();
    const { branding, labels, buildPath } = useTenant();
    const routerNavigate = useRouterNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 브랜딩 헤더 색상 기반 다크 테마 자동 감지
    const isThemeDark = isDarkTheme(branding.headerBgColor);

    // 테마별 배경 클래스 가져오기
    const themeClass = getThemeClass(branding.primaryColor, branding.headerBgColor, branding.backgroundColor);
    const glowOrbs = getGlowOrbClasses(branding.primaryColor, branding.headerBgColor, branding.backgroundColor);

    // 커스텀 배경색이 있거나 테마가 있는 경우
    const hasCustomBackground = branding.backgroundColor && branding.backgroundColor.trim() !== '';
    const hasThemeBackground = themeClass !== '' && themeClass !== 'bg-gray-50';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login(formData);
            login(response);

            // TENANT_ADMIN이고 tenantCode가 있으면 해당 테넌트의 브랜딩 설정 페이지로
            if (response.role === 'TENANT_ADMIN' && response.tenantCode) {
                routerNavigate(`/${response.tenantCode}/tenant-admin/branding`);
            }
            // SUPER_ADMIN은 슈퍼 관리자 페이지로
            else if (response.role === 'SUPER_ADMIN') {
                routerNavigate('/super-admin/tenants');
            }
            // 운영자/관리자면 대시보드로 (tenantCode 포함)
            else if ((response.role === 'OPERATOR' || response.role === 'ADMIN') && response.tenantCode) {
                routerNavigate(`/${response.tenantCode}/operator/dashboard`);
            }
            // 강사면 테넌트 홈으로
            else if (response.role === 'INSTRUCTOR' && response.tenantCode) {
                routerNavigate(`/${response.tenantCode}/`);
            }
            // 일반 유저 (tenantCode가 있으면 해당 테넌트 홈으로)
            else if (response.tenantCode) {
                routerNavigate(`/${response.tenantCode}/`);
            }
            // tenantCode가 없으면 기본 홈으로
            else {
                routerNavigate('/');
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || '로그인에 실패했습니다.');
            } else {
                setError('로그인에 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    // 테마별 로그인 페이지
    if (hasCustomBackground || hasThemeBackground) {
        return (
            <div
                className={`min-h-screen ${hasCustomBackground ? '' : themeClass} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}
                style={hasCustomBackground ? { backgroundColor: branding.backgroundColor } : undefined}
            >
                {/* 배경 효과 */}
                {isThemeDark && <div className="star-field"></div>}
                {glowOrbs.primary && <div className={`glow-orb ${glowOrbs.primary} w-96 h-96 top-20 -left-48`}></div>}
                {glowOrbs.secondary && <div className={`glow-orb ${glowOrbs.secondary} w-80 h-80 bottom-20 -right-40 animation-delay-2000`}></div>}

                <div className="max-w-md w-full relative z-10 fade-in-up">
                    {/* 로고 */}
                    <div className="text-center mb-8">
                        <Link to={buildPath('/')} className="inline-flex items-center gap-2 group">
                            {branding.logoUrl ? (
                                <img src={branding.logoUrl} alt="Logo" className="h-12 w-auto" />
                            ) : (
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
                                    style={{ backgroundColor: branding.primaryColor }}
                                >
                                    <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            )}
                            <span className="text-2xl font-bold text-white">{labels.platformName}</span>
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-white">
                            다시 오신 것을 <span className="text-gradient-megazone">환영합니다</span>
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            학습을 이어가려면 로그인하세요
                        </p>
                    </div>

                    {/* 로그인 폼 - 글래스모피즘 */}
                    <div className="glass-card p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                    이메일
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-white">
                                        비밀번호
                                    </label>
                                    <Link
                                        to={buildPath('/forgot-password')}
                                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        비밀번호를 잊으셨나요?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-300 flex-1">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-neon w-full flex justify-center items-center gap-2 py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>로그인 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span>로그인</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-transparent text-gray-400">또는</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="text-center">
                                    <span className="text-sm text-gray-400">아직 계정이 없으신가요? </span>
                                    <Link
                                        to={buildPath('/signup')}
                                        className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        회원가입하기
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <Link
                                        to="/apply-tenant"
                                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="font-medium">기업 계정 신청</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 하단 링크 */}
                    <div className="mt-8 text-center">
                        <Link
                            to={buildPath('/')}
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>홈으로 돌아가기</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 라이트 테마 (기본) 로그인 페이지
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* 로고 */}
                <div className="text-center mb-8">
                    <Link to={buildPath('/')} className="inline-flex items-center gap-2 group">
                        {branding.logoUrl ? (
                            <img src={branding.logoUrl} alt="Logo" className="h-12 w-auto" />
                        ) : (
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow"
                                style={{ backgroundColor: branding.primaryColor }}
                            >
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        )}
                        <span className="text-2xl font-bold text-gray-900">{labels.platformName}</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        다시 오신 것을 환영합니다
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        학습을 이어가려면 로그인하세요
                    </p>
                </div>

                {/* 로그인 폼 */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                이메일
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                                    style={{
                                        '--tw-ring-color': branding.primaryColor,
                                    } as React.CSSProperties}
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    비밀번호
                                </label>
                                <Link
                                    to={buildPath('/forgot-password')}
                                    className="text-xs font-medium hover:opacity-80"
                                    style={{ color: branding.primaryColor }}
                                >
                                    비밀번호를 잊으셨나요?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-600 flex-1">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90"
                            style={{
                                backgroundColor: branding.buttonPrimaryBgColor,
                                color: branding.buttonPrimaryTextColor,
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>로그인 중...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>로그인</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">또는</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="text-center">
                                <span className="text-sm text-gray-600">아직 계정이 없으신가요? </span>
                                <Link
                                    to={buildPath('/signup')}
                                    className="text-sm font-semibold transition-colors hover:opacity-80"
                                    style={{ color: branding.primaryColor }}
                                >
                                    회원가입하기
                                </Link>
                            </div>
                            <div className="text-center pt-3 border-t border-gray-200">
                                <Link
                                    to="/apply-tenant"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors group"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="font-medium">기업 계정 신청 (플랫폼 도입)</span>
                                </Link>
                                <p className="text-xs text-gray-500 mt-1">
                                    회사에서 플랫폼을 사용하시려면 여기서 신청하세요
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 링크 */}
                <div className="mt-8 text-center">
                    <Link
                        to={buildPath('/')}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>홈으로 돌아가기</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
