import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { updateTenantBranding } from '../../api/tenant';
import { Navbar } from '../../components/Navbar';
import { getErrorMessage } from '../../lib/errorHandler';
import { LayoutConfigEditor } from '../../components/branding/LayoutConfigEditor';
import type { LayoutRole } from '../../types/layout';
import {
  LAYOUT_ROLE_LABELS,
  LAYOUT_ROLE_DESCRIPTIONS,
  DEFAULT_LAYOUTS_BY_ROLE,
  layoutConfigToJson,
} from '../../types/layout';

type RoleLayoutState = {
  tenantAdmin: string | null;
  operator: string | null;
  user: string | null;
};

export default function LayoutSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { branding, refreshTenant } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState<LayoutRole>('tenantAdmin');
  const isInitializedRef = useRef(false);

  // 역할별 레이아웃 설정 상태
  const [roleLayouts, setRoleLayouts] = useState<RoleLayoutState>({
    tenantAdmin: branding?.layoutConfigTenantAdmin || null,
    operator: branding?.layoutConfigOperator || null,
    user: branding?.layoutConfigUser || null,
  });

  // 초기 로드 시에만 branding에서 상태 업데이트
  useEffect(() => {
    if (branding && !isInitializedRef.current) {
      setRoleLayouts({
        tenantAdmin: branding.layoutConfigTenantAdmin || null,
        operator: branding.layoutConfigOperator || null,
        user: branding.layoutConfigUser || null,
      });
      isInitializedRef.current = true;
    }
  }, [branding]);

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

  const handleLayoutChange = (layoutConfigJson: string) => {
    setRoleLayouts((prev) => ({
      ...prev,
      [selectedRole]: layoutConfigJson,
    }));
  };

  const handleSave = async () => {
    const tenantId = branding?.tenantId;
    if (!tenantId) {
      setMessage({ type: 'error', text: '테넌트 정보를 찾을 수 없습니다.' });
      return;
    }

    try {
      setIsSaving(true);
      // API 응답으로 반환된 branding 데이터 사용
      const updatedBranding = await updateTenantBranding(tenantId, {
        layoutConfigTenantAdmin: roleLayouts.tenantAdmin || undefined,
        layoutConfigOperator: roleLayouts.operator || undefined,
        layoutConfigUser: roleLayouts.user || undefined,
      });

      // 서버 응답으로 로컬 상태 동기화 (저장된 값 확인)
      setRoleLayouts({
        tenantAdmin: updatedBranding.layoutConfigTenantAdmin || roleLayouts.tenantAdmin,
        operator: updatedBranding.layoutConfigOperator || roleLayouts.operator,
        user: updatedBranding.layoutConfigUser || roleLayouts.user,
      });

      // 전역 상태도 업데이트
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

  const handleResetRole = () => {
    const defaultConfig = DEFAULT_LAYOUTS_BY_ROLE[selectedRole];
    const defaultJson = layoutConfigToJson(defaultConfig);
    setRoleLayouts((prev) => ({
      ...prev,
      [selectedRole]: defaultJson,
    }));
  };

  const roles: LayoutRole[] = ['tenantAdmin', 'operator', 'user'];

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
              <h1 className="text-3xl font-bold text-gray-900">역할별 레이아웃 설정</h1>
              <p className="text-gray-600 mt-2">
                각 역할별로 대시보드, 배너, 메뉴의 컴포넌트 표시/숨김 및 순서를 설정하세요
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
              {isSaving ? '저장 중...' : '모든 설정 저장'}
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

        {/* 역할 선택 탭 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                    selectedRole === role
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">
                      {role === 'tenantAdmin' && '👤'}
                      {role === 'operator' && '🔧'}
                      {role === 'user' && '📚'}
                    </span>
                    <span>{LAYOUT_ROLE_LABELS[role]}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* 선택된 역할 설명 */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {LAYOUT_ROLE_LABELS[selectedRole]} 레이아웃
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {LAYOUT_ROLE_DESCRIPTIONS[selectedRole]}
                </p>
              </div>
              <button
                onClick={handleResetRole}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                이 역할 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 레이아웃 설정 에디터 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LayoutConfigEditor
            layoutConfigJson={roleLayouts[selectedRole]}
            onChange={handleLayoutChange}
            role={selectedRole}
          />
        </div>

        {/* 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 각 역할별로 다른 레이아웃을 설정할 수 있습니다</li>
            <li>• 설정을 변경한 후 반드시 "모든 설정 저장" 버튼을 눌러주세요</li>
            <li>• 컴포넌트를 드래그하여 순서를 변경할 수 있습니다</li>
            <li>• 체크박스를 클릭하여 컴포넌트를 표시하거나 숨길 수 있습니다</li>
            <li>• "이 역할 초기화" 버튼을 누르면 해당 역할의 기본 설정으로 복원됩니다</li>
          </ul>
        </div>

        {/* 역할별 설정 요약 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => {
            const isConfigured = roleLayouts[role] !== null;
            const isSelected = selectedRole === role;
            return (
              <div
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {LAYOUT_ROLE_LABELS[role]}
                  </span>
                  {isConfigured ? (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      설정됨
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      기본값
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {LAYOUT_ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
