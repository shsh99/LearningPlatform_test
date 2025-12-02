import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { updateTenantBranding } from '../../api/tenant';
import { Navbar } from '../../components/Navbar';
import { getErrorMessage } from '../../lib/errorHandler';
import { LayoutConfigEditor } from '../../components/branding/LayoutConfigEditor';

export default function LayoutSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tenant, refreshTenant } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [layoutConfigJson, setLayoutConfigJson] = useState<string | null>(
    tenant?.branding?.layoutConfig || null
  );

  // 권한 확인 (SUPER_ADMIN, TENANT_ADMIN, ADMIN만 접근 가능)
  const hasAccess = user?.role === 'SUPER_ADMIN' || user?.role === 'TENANT_ADMIN' || user?.role === 'ADMIN';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
            <p className="text-gray-600 mb-6">
              이 페이지는 관리자만 접근할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    const tenantId = tenant?.id;
    if (!tenantId) {
      setMessage({ type: 'error', text: '테넌트 정보를 찾을 수 없습니다.' });
      return;
    }

    try {
      setIsSaving(true);
      await updateTenantBranding(tenantId, { layoutConfig: layoutConfigJson || undefined });
      await refreshTenant();
      setMessage({ type: 'success', text: '레이아웃 설정이 저장되었습니다.' });
    } catch (error) {
      console.error('Failed to save layout config:', error);
      const errorMessage = getErrorMessage(error);
      setMessage({ type: 'error', text: `설정 저장 실패: ${errorMessage}` });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate('/tenant-admin/branding')}
              className="hover:text-gray-900"
            >
              브랜딩 설정
            </button>
            <span>/</span>
            <span className="text-gray-900">레이아웃 설정</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">레이아웃 설정</h1>
              <p className="text-gray-600 mt-2">
                대시보드, 배너, 메뉴의 컴포넌트 표시/숨김 및 순서를 조정하세요
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSaving
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>

        {/* 메시지 */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 레이아웃 설정 에디터 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LayoutConfigEditor
            layoutConfigJson={layoutConfigJson}
            onChange={setLayoutConfigJson}
          />
        </div>

        {/* 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 설정을 변경한 후 반드시 "저장" 버튼을 눌러주세요</li>
            <li>• 컴포넌트를 드래그하여 순서를 변경할 수 있습니다</li>
            <li>• 체크박스를 클릭하여 컴포넌트를 표시하거나 숨길 수 있습니다</li>
            <li>• 초기화 버튼을 누르면 기본 설정으로 복원됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
