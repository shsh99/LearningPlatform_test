import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTenants } from '../../api/tenant';
import { useTenant } from '../../contexts/TenantContext';
import { Navbar } from '../../components/Navbar';
import type { Tenant } from '../../types/tenant';

export function TenantManagementPage() {
  const { branding } = useTenant();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTenants();
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

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: branding.primaryColor }}></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: branding.primaryColor }}>
                테넌트 관리
              </h1>
              <p className="text-gray-600 mt-2">
                모든 테넌트를 조회하고 관리합니다.
              </p>
            </div>

            <Link
              to="/super-admin/create-tenant-admin"
              className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all"
              style={{
                backgroundColor: branding.buttonPrimaryBgColor,
                color: branding.buttonPrimaryTextColor,
              }}
            >
              + 테넌트 어드민 생성
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    테넌트명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    코드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tenant.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {tenant.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tenant.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tenant.status === 'ACTIVE' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tenant.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="hover:opacity-70 transition-opacity"
                        style={{ color: branding.primaryColor }}
                        onClick={() => alert('상세 보기 기능은 추후 구현 예정입니다.')}
                      >
                        상세 보기
                      </button>
                    </td>
                  </tr>
                ))}

                {tenants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      등록된 테넌트가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 SUPER_ADMIN 권한</h3>
            <p className="text-sm text-blue-800">
              SUPER_ADMIN은 모든 테넌트의 데이터를 조회하고 관리할 수 있습니다.
              각 테넌트의 어드민 계정을 생성하여 테넌트별 관리를 위임할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
