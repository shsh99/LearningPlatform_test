import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authApi } from '../api/auth';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || email.trim().length === 0) {
      setError('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.forgotPassword({ email });
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to send reset email:', err);
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || '비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');
      } else {
        setError('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">이메일을 확인해주세요</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium text-gray-900">{email}</span>로
              </p>
              <p className="text-gray-600 mb-6">
                비밀번호 재설정 링크를 전송했습니다.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                이메일이 도착하지 않았다면 스팸 메일함을 확인해주세요.
                <br />
                링크는 1시간 동안 유효합니다.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                로그인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
          <p className="text-gray-600">
            가입하신 이메일 주소를 입력해주세요.
            <br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="example@email.com"
              autoComplete="email"
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '전송 중...' : '재설정 링크 전송'}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                로그인으로 돌아가기
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
