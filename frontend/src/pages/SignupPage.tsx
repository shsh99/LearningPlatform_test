import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate as useRouterNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { validatePassword, validatePasswordConfirm, getPasswordHelperText } from '../utils/validation';
import { isDarkTheme, getThemeClass, getGlowOrbClasses } from '../utils/theme';

export function SignupPage() {
    const routerNavigate = useRouterNavigate();
    const { login } = useAuth();
    const { branding, labels, navigate } = useTenant();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        tenantCode: '',
    });
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [passwordConfirmErrors, setPasswordConfirmErrors] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 브랜딩 헤더 색상 기반 다크 테마 자동 감지
    const isThemeDark = isDarkTheme(branding.headerBgColor);

    // 테마별 배경 클래스 가져오기
    const themeClass = getThemeClass(branding.primaryColor, branding.headerBgColor, branding.backgroundColor);
    const glowOrbs = getGlowOrbClasses(branding.primaryColor, branding.headerBgColor, branding.backgroundColor);

    // 커스텀 배경색이 있는 경우
    const hasCustomBackground = branding.backgroundColor && branding.backgroundColor.trim() !== '';

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setFormData({ ...formData, password: newPassword });

        const validation = validatePassword(newPassword);
        setPasswordErrors(validation.errors);

        if (formData.passwordConfirm) {
            const confirmValidation = validatePasswordConfirm(newPassword, formData.passwordConfirm);
            setPasswordConfirmErrors(confirmValidation.errors);
        }
    };

    const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordConfirm = e.target.value;
        setFormData({ ...formData, passwordConfirm: newPasswordConfirm });

        const validation = validatePasswordConfirm(formData.password, newPasswordConfirm);
        setPasswordConfirmErrors(validation.errors);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
            setPasswordErrors(validation.errors);
            return;
        }

        const confirmValidation = validatePasswordConfirm(formData.password, formData.passwordConfirm);
        if (!confirmValidation.isValid) {
            setPasswordConfirmErrors(confirmValidation.errors);
            return;
        }

        setLoading(true);

        try {
            const { passwordConfirm, ...signupData } = formData;
            // tenantCode가 빈 문자열이면 undefined로 변환
            const requestData = {
                ...signupData,
                tenantCode: signupData.tenantCode?.trim() || undefined,
            };
            const response = await authApi.signup(requestData);
            login(response);

            // tenantCode가 있으면 해당 테넌트 홈으로, 없으면 기본 홈으로
            if (response.tenantCode) {
                routerNavigate(`/${response.tenantCode}/`);
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || '회원가입에 실패했습니다.');
            } else {
                setError('회원가입에 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${hasCustomBackground ? '' : themeClass}`}
            style={hasCustomBackground ? { backgroundColor: branding.backgroundColor } : undefined}
        >
            {/* 테마별 배경 효과 */}
            {(hasCustomBackground || themeClass !== 'bg-gray-50') && (
                <>
                    {isThemeDark && <div className="star-field"></div>}
                    {glowOrbs.primary && <div className={`glow-orb ${glowOrbs.primary} w-96 h-96 top-20 -left-48`}></div>}
                    {glowOrbs.secondary && <div className={`glow-orb ${glowOrbs.secondary} w-80 h-80 bottom-20 -right-40 animation-delay-2000`}></div>}
                </>
            )}

            <div className={`max-w-md w-full space-y-8 ${isThemeDark ? 'relative z-10 fade-in-up' : ''}`}>
                {/* 로고 및 타이틀 */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 group">
                        {branding.logoUrl ? (
                            <img src={branding.logoUrl} alt="Logo" className="h-12 w-auto" />
                        ) : (
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow ${isThemeDark ? 'shadow-lg shadow-emerald-500/20' : ''}`}
                                style={{ backgroundColor: branding.primaryColor }}
                            >
                                <svg className={`w-7 h-7 ${isThemeDark ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        )}
                        <span className={`text-2xl font-bold ${isThemeDark ? 'text-white' : 'text-gray-900'}`}>{labels.platformName}</span>
                    </Link>
                </div>
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle className="text-center">회원가입</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="이메일"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="your@email.com"
                            />

                            <div>
                                <Input
                                    label="비밀번호"
                                    type="password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="8-20자, 특수문자 포함"
                                    helperText={getPasswordHelperText()}
                                />
                                {passwordErrors.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {passwordErrors.map((error, index) => (
                                            <p key={index} className="text-sm text-red-600">
                                                • {error}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Input
                                    label="비밀번호 확인"
                                    type="password"
                                    value={formData.passwordConfirm}
                                    onChange={handlePasswordConfirmChange}
                                    required
                                    placeholder="비밀번호를 다시 입력해주세요"
                                    helperText="비밀번호를 다시 입력해주세요"
                                />
                                {passwordConfirmErrors.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {passwordConfirmErrors.map((error, index) => (
                                            <p key={index} className="text-sm text-red-600">
                                                • {error}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Input
                                label="이름"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                minLength={2}
                                maxLength={20}
                                placeholder="홍길동"
                                helperText="2-20자 사이로 입력해주세요"
                            />

                            <Input
                                label="회사코드 (선택)"
                                type="text"
                                value={formData.tenantCode}
                                onChange={(e) => setFormData({ ...formData, tenantCode: e.target.value })}
                                placeholder="samsung"
                                helperText="소속 회사가 있는 경우 회사코드를 입력하세요"
                            />

                            {error && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <Button type="submit" fullWidth disabled={loading || passwordErrors.length > 0 || passwordConfirmErrors.length > 0}>
                                {loading ? '처리 중...' : '회원가입'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">이미 계정이 있으신가요? </span>
                            <Link
                                to="/login"
                                className="font-medium hover:opacity-80"
                                style={{ color: branding.primaryColor }}
                            >
                                로그인
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
