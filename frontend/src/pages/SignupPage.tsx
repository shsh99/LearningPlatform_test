import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';

export function SignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.signup(formData);
            login(response);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
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

                            <Input
                                label="비밀번호"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={8}
                                maxLength={20}
                                placeholder="8-20자"
                                helperText="8-20자 사이로 입력해주세요"
                            />

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

                            <Button type="submit" fullWidth disabled={loading}>
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
