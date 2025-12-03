import { useState, useEffect } from 'react';
import { DraggableList } from '../common/DraggableList';
import type {
  LayoutConfig,
  WidgetConfig,
  MenuItemConfig,
  LayoutRole,
} from '../../types/layout';
import {
  parseLayoutConfigForRole,
  layoutConfigToJson,
  DEFAULT_LAYOUTS_BY_ROLE,
  LAYOUT_ROLE_LABELS,
} from '../../types/layout';

interface LayoutConfigEditorProps {
  layoutConfigJson: string | null;
  onChange: (layoutConfigJson: string) => void;
  role?: LayoutRole;
}

export function LayoutConfigEditor({ layoutConfigJson, onChange, role = 'operator' }: LayoutConfigEditorProps) {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() =>
    parseLayoutConfigForRole(layoutConfigJson, role)
  );
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu'>('dashboard');

  useEffect(() => {
    setLayoutConfig(parseLayoutConfigForRole(layoutConfigJson, role));
  }, [layoutConfigJson, role]);

  const handleConfigChange = (newConfig: LayoutConfig) => {
    setLayoutConfig(newConfig);
    onChange(layoutConfigToJson(newConfig));
  };

  // 대시보드 위젯 관리
  const handleDashboardReorder = (reorderedWidgets: WidgetConfig[]) => {
    handleConfigChange({
      ...layoutConfig,
      dashboard: {
        ...layoutConfig.dashboard!,
        widgets: reorderedWidgets,
      },
    });
  };

  const handleDashboardToggle = (id: string, enabled: boolean) => {
    const updatedWidgets = layoutConfig.dashboard!.widgets.map((widget) =>
      widget.id === id ? { ...widget, enabled } : widget
    );
    handleConfigChange({
      ...layoutConfig,
      dashboard: {
        ...layoutConfig.dashboard!,
        widgets: updatedWidgets,
      },
    });
  };

  // 메뉴 아이템 관리
  const handleMenuReorder = (reorderedItems: MenuItemConfig[]) => {
    handleConfigChange({
      ...layoutConfig,
      menu: {
        items: reorderedItems,
      },
    });
  };

  const handleMenuToggle = (id: string, enabled: boolean) => {
    const updatedItems = layoutConfig.menu!.items.map((item) =>
      item.id === id ? { ...item, enabled } : item
    );
    handleConfigChange({
      ...layoutConfig,
      menu: {
        items: updatedItems,
      },
    });
  };

  // 초기화
  const handleReset = () => {
    handleConfigChange(DEFAULT_LAYOUTS_BY_ROLE[role]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 왼쪽: 설정 영역 */}
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">레이아웃 설정</h3>
            <p className="text-sm text-gray-600 mt-1">
              컴포넌트의 표시/숨김 및 순서를 조정할 수 있습니다
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            초기화
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            대시보드 위젯
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'menu'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            메뉴
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">대시보드 위젯 관리</h4>
                <span className="text-sm text-gray-600">
                  {layoutConfig.dashboard?.widgets.filter((w) => w.enabled).length} /{' '}
                  {layoutConfig.dashboard?.widgets.length} 활성
                </span>
              </div>
              <DraggableList
                items={layoutConfig.dashboard?.widgets || []}
                onReorder={handleDashboardReorder}
                onToggle={handleDashboardToggle}
              />
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">메뉴 관리</h4>
                <span className="text-sm text-gray-600">
                  {layoutConfig.menu?.items.filter((m) => m.enabled).length} /{' '}
                  {layoutConfig.menu?.items.length} 활성
                </span>
              </div>
              <DraggableList
                items={layoutConfig.menu?.items || []}
                onReorder={handleMenuReorder}
                onToggle={handleMenuToggle}
                renderItem={(item) => (
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <span className="text-gray-500 text-sm">{item.icon}</span>
                    )}
                    <span className={item.enabled ? 'text-gray-900' : 'text-gray-400'}>
                      {item.label || item.id}
                    </span>
                    {item.path && (
                      <span className="text-xs text-gray-500">({item.path})</span>
                    )}
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {/* 도움말 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-900 mb-2">사용 방법</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 항목을 드래그하여 순서를 변경할 수 있습니다</li>
            <li>• 체크박스를 클릭하여 항목을 표시하거나 숨길 수 있습니다</li>
            <li>• 변경사항은 "저장" 버튼을 눌러야 적용됩니다</li>
          </ul>
        </div>
      </div>

      {/* 오른쪽: 미리보기 영역 */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">미리보기</h3>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {LAYOUT_ROLE_LABELS[role]}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {LAYOUT_ROLE_LABELS[role]}가 보게 될 레이아웃 미리보기입니다
          </p>
        </div>

        {/* 대시보드 위젯 미리보기 */}
        {layoutConfig.dashboard?.enabled && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-3">대시보드 위젯</div>
            <div className="grid grid-cols-2 gap-3">
              {layoutConfig.dashboard.widgets
                .filter((widget) => widget.enabled)
                .sort((a, b) => a.order - b.order)
                .map((widget) => (
                  <div
                    key={widget.id}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg relative"
                  >
                    <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                      #{widget.order}
                    </span>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {widget.label || widget.id}
                    </div>
                    <div className="h-12 bg-white rounded border border-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400">위젯 내용</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 메뉴 미리보기 */}
        {layoutConfig.menu && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-3">메뉴</div>
            <div className="space-y-1">
              {layoutConfig.menu.items
                .filter((item) => item.enabled)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <span className="text-gray-400 text-sm">{item.icon}</span>
                      )}
                      <span className="text-sm text-gray-700">{item.label || item.id}</span>
                      {item.path && (
                        <span className="text-xs text-gray-400">({item.path})</span>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      #{item.order}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 요약 정보 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-green-900 uppercase mb-3">활성화된 항목</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">대시보드 위젯</span>
              <span className="font-semibold text-green-700">
                {layoutConfig.dashboard?.widgets.filter((w) => w.enabled).length || 0}개
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">메뉴 항목</span>
              <span className="font-semibold text-green-700">
                {layoutConfig.menu?.items.filter((m) => m.enabled).length || 0}개
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
