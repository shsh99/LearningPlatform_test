import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTenantAdmin } from '../../api/user';
import { getActiveTenants } from '../../api/tenant';
import { useTenant } from '../../contexts/TenantContext';
import { Navbar } from '../../components/Navbar';
import type { CreateTenantAdminRequest } from '../../types/user';
import type { Tenant } from '../../types/tenant';

export function CreateTenantAdminPage() {
  const navigate = useNavigate();
  const { branding } = useTenant();
  const [formData, setFormData] = useState<CreateTenantAdminRequest>({
    tenantId: 0,
    email: '',
    password: '',
    name: '',
  });
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setIsLoading(true);
        const data = await getActiveTenants();
        setTenants(data);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
        alert('테넌트 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenantId) {
      alert('테넌트를 선택해주세요.');
      return;
    }

    if (formData.password.length < 8 || formData.password.length > 20) {
      alert('비밀번호는 8~20자여야 합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createTenantAdmin(formData);
      alert('테넌트 어드민이 성공적으로 생성되었습니다.');
      navigate('/super-admin/tenants');
    } catch (error: any) {
      const message = error.response?.data?.message || '테넌트 어드민 생성에 실패했습니다.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tenantId' ? Number(value) : value,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: branding.primaryColor }}>
              테넌트 어드민 생성
            </h1>
            <p className="text-gray-600 mb-6">
              새로운 테넌트의 관리자를 생성합니다.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 mb-2">
                  테넌트 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  id="tenantId"
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  style={{
                    outlineColor: branding.primaryColor,
                  }}
                >
                  <option value="0">
                    {isLoading ? '로딩 중...' : '테넌트를 선택하세요'}
                  </option>
                  {tenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={20}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  placeholder="관리자 이름"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={20}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50"
                  placeholder="8~20자"
                />
                <p className="mt-1 text-sm text-gray-500">
                  비밀번호는 8~20자여야 합니다.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: branding.buttonPrimaryBgColor,
                    color: branding.buttonPrimaryTextColor,
                  }}
                >
                  {isSubmitting ? '생성 중...' : '테넌트 어드민 생성'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/super-admin/tenants')}
                  className="flex-1 py-3 rounded-lg border-2 font-medium hover:bg-gray-50 transition-all"
                  style={{
                    borderColor: branding.primaryColor,
                    color: branding.primaryColor,
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
