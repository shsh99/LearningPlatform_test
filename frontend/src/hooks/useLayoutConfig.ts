import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';
import type { LayoutConfig, LayoutRole, WidgetConfig } from '../types/layout';
import {
  parseLayoutConfigForRole,
  DEFAULT_TENANT_ADMIN_LAYOUT,
  DEFAULT_OPERATOR_LAYOUT,
  DEFAULT_USER_LAYOUT,
} from '../types/layout';

/**
 * 현재 사용자의 역할에 맞는 레이아웃 설정을 가져오는 Hook
 */
export function useLayoutConfig() {
  const { branding } = useTenant();
  const { user } = useAuth();

  // 사용자 역할을 레이아웃 역할로 매핑
  const layoutRole = useMemo<LayoutRole>(() => {
    if (!user?.role) return 'user';

    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'TENANT_ADMIN':
      case 'ADMIN':
        return 'tenantAdmin';
      case 'OPERATOR':
        return 'operator';
      case 'USER':
      case 'INSTRUCTOR':
      default:
        return 'user';
    }
  }, [user?.role]);

  // 레이아웃 설정 가져오기
  const layoutConfig = useMemo<LayoutConfig>(() => {
    let configJson: string | null = null;

    switch (layoutRole) {
      case 'tenantAdmin':
        configJson = branding?.layoutConfigTenantAdmin || null;
        break;
      case 'operator':
        configJson = branding?.layoutConfigOperator || null;
        break;
      case 'user':
        configJson = branding?.layoutConfigUser || null;
        break;
    }

    return parseLayoutConfigForRole(configJson, layoutRole);
  }, [branding, layoutRole]);

  // 대시보드 위젯 목록 (활성화된 것만, 순서대로)
  const dashboardWidgets = useMemo<WidgetConfig[]>(() => {
    if (!layoutConfig.dashboard?.widgets) {
      return [];
    }

    return layoutConfig.dashboard.widgets
      .filter((widget) => widget.enabled)
      .sort((a, b) => a.order - b.order);
  }, [layoutConfig.dashboard?.widgets]);

  // 특정 위젯이 활성화되어 있는지 확인
  const isWidgetEnabled = (widgetId: string): boolean => {
    const widget = layoutConfig.dashboard?.widgets?.find((w) => w.id === widgetId);
    return widget?.enabled ?? false;
  };

  // 특정 위젯의 순서 가져오기
  const getWidgetOrder = (widgetId: string): number => {
    const widget = layoutConfig.dashboard?.widgets?.find((w) => w.id === widgetId);
    return widget?.order ?? 999;
  };

  // 대시보드 전체가 활성화되어 있는지
  const isDashboardEnabled = layoutConfig.dashboard?.enabled ?? true;

  return {
    layoutRole,
    layoutConfig,
    dashboardWidgets,
    isDashboardEnabled,
    isWidgetEnabled,
    getWidgetOrder,
  };
}

/**
 * 역할을 직접 지정하여 레이아웃 설정을 가져오는 Hook
 */
export function useLayoutConfigForRole(role: LayoutRole) {
  const { branding } = useTenant();

  const layoutConfig = useMemo<LayoutConfig>(() => {
    let configJson: string | null = null;

    switch (role) {
      case 'tenantAdmin':
        configJson = branding?.layoutConfigTenantAdmin || null;
        break;
      case 'operator':
        configJson = branding?.layoutConfigOperator || null;
        break;
      case 'user':
        configJson = branding?.layoutConfigUser || null;
        break;
    }

    return parseLayoutConfigForRole(configJson, role);
  }, [branding, role]);

  const dashboardWidgets = useMemo<WidgetConfig[]>(() => {
    if (!layoutConfig.dashboard?.widgets) {
      return [];
    }

    return layoutConfig.dashboard.widgets
      .filter((widget) => widget.enabled)
      .sort((a, b) => a.order - b.order);
  }, [layoutConfig.dashboard?.widgets]);

  const isWidgetEnabled = (widgetId: string): boolean => {
    const widget = layoutConfig.dashboard?.widgets?.find((w) => w.id === widgetId);
    return widget?.enabled ?? false;
  };

  const getWidgetOrder = (widgetId: string): number => {
    const widget = layoutConfig.dashboard?.widgets?.find((w) => w.id === widgetId);
    return widget?.order ?? 999;
  };

  return {
    layoutConfig,
    dashboardWidgets,
    isDashboardEnabled: layoutConfig.dashboard?.enabled ?? true,
    isWidgetEnabled,
    getWidgetOrder,
  };
}
