import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authApi } from '../api/auth';
import { validatePassword, validatePasswordConfirm } from '../utils/validation';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!token) {
      setErrors(['유효하지 않은 재설정 링크입니다.']);
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setErrors(passwordValidation.errors);
      return;
    }

    const confirmValidation = validatePasswordConfirm(newPassword, confirmPassword);
    if (!confirmValidation.isValid) {
      setErrors(confirmValidation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (err) {
      console.error('Failed to reset password:', err);

      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          setErrors([err.response.data.message]);
        } else if (err.response?.data?.code === 'A011') {
          setErrors(['새 비밀번호는 기존 비밀번호와 달라야 합니다.']);
        } else if (err.response?.data?.code === 'A009') {
          setErrors(['재설정 토큰이 만료되었습니다. 다시 요청해주세요.']);
        } else if (err.response?.data?.code === 'A010') {
          setErrors(['이미 사용된 재설정 토큰입니다.']);
        } else if (err.response?.data?.code === 'A008') {
          setErrors(['유효하지 않은 재설정 토큰입니다.']);
        } else {
          setErrors(['비밀번호 재설정에 실패했습니다. 다시 시도해주세요.']);
        }
      } else {
        setErrors(['비밀번호 재설정에 실패했습니다. 다시 시도해주세요.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">비밀번호 재설정</h1>
          <p className="text-gray-600">
            새로운 비밀번호를 입력해주세요.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-800 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}

            <Input
              type="password"
              label="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              helperText="8-20자, 특수문자 포함"
              disabled={isSubmitting}
            />

            <Input
              type="password"
              label="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '재설정 중...' : '비밀번호 재설정'}
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
            링크가 만료되었나요?{' '}
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              재설정 다시 요청
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
