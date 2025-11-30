import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTenantApplication } from '../api/tenantApplication';
import type { CreateTenantApplicationRequest } from '../types/tenantApplication';

/**
 * 비회원 테넌트 신청 페이지
 * 회사가 플랫폼 사용을 신청하는 페이지
 */
export function ApplyTenantPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateTenantApplicationRequest>({
    companyName: '',
    companyCode: '',
    adminName: '',
    adminEmail: '',
    phoneNumber: '',
    businessNumber: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyCode.match(/^[a-z0-9-]+$/)) {
      alert('회사 코드는 영소문자, 숫자, 하이픈만 사용 가능합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createTenantApplication(formData);
      alert('테넌트 신청이 완료되었습니다. 관리자 승인 후 이메일로 안내드리겠습니다.');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || '신청에 실패했습니다. 다시 시도해주세요.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              플랫폼 사용 신청
            </h1>
            <p className="text-gray-600">
              회사 정보를 입력하시면 관리자 검토 후 승인해드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  회사명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="주식회사 ABC"
                />
              </div>

              <div>
                <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700 mb-2">
                  회사 코드 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyCode"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={50}
                  pattern="[a-z0-9-]+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="abc-company"
                />
                <p className="mt-1 text-xs text-gray-500">
                  영소문자, 숫자, 하이픈만 사용 가능 (예: samsung, sk-hynix)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-2">
                  담당자명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="adminName"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  담당자 이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                />
              </div>

              <div>
                <label htmlFor="businessNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  사업자등록번호
                </label>
                <input
                  type="text"
                  id="businessNumber"
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123-45-67890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                신청 사유
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="플랫폼 사용 목적을 간단히 작성해주세요."
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {formData.description?.length || 0} / 1000
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '신청 중...' : '신청하기'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">안내사항</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 신청 후 관리자 검토를 거쳐 승인됩니다.</li>
              <li>• 승인 완료 시 입력하신 이메일로 안내 메일이 발송됩니다.</li>
              <li>• 회사 코드는 승인 후 변경할 수 없으니 신중히 입력해주세요.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
