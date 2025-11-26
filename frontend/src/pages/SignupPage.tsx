import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { validatePassword, validatePasswordConfirm, getPasswordHelperText } from '../utils/validation';

export function SignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
    });
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [passwordConfirmErrors, setPasswordConfirmErrors] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            const response = await authApi.signup(signupData);
            login(response);
            navigate('/');
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
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
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                로그인
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
