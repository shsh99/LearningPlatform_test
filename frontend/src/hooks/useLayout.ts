import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';
import type {
  LayoutConfig,
  ComponentConfig,
  WidgetConfig,
  MenuItemConfig,
  BannerConfig,
  LayoutRole,
} from '../types/layout';
import { parseLayoutConfigForRole, DEFAULT_LAYOUTS_BY_ROLE } from '../types/layout';

/**
 * 사용자 역할을 레이아웃 역할로 매핑
 */
function getUserLayoutRole(userRole: string | undefined): LayoutRole {
  switch (userRole) {
    case 'SUPER_ADMIN':
      return 'superAdmin';
    case 'TENANT_ADMIN':
      return 'tenantAdmin';
    case 'OPERATOR':
    case 'ADMIN':
      return 'operator';
    case 'USER':
    default:
      return 'user';
  }
}

/**
 * 레이아웃 설정을 관리하는 Hook
 * 현재 로그인한 사용자의 역할에 맞는 레이아웃 설정을 반환
 */
export function useLayout() {
  const { branding } = useTenant();
  const { user } = useAuth();

  // 사용자 역할에 따른 레이아웃 역할 결정
  const layoutRole = useMemo<LayoutRole>(() => {
    return getUserLayoutRole(user?.role);
  }, [user?.role]);

  // 역할에 맞는 레이아웃 설정 JSON 선택
  // SUPER_ADMIN은 DB에 저장된 설정이 없으므로 항상 기본 레이아웃 사용
  const layoutConfigJson = useMemo(() => {
    if (!branding) return null;

    switch (layoutRole) {
      case 'superAdmin':
        return null; // SUPER_ADMIN은 기본 레이아웃 사용
      case 'tenantAdmin':
        return branding.layoutConfigTenantAdmin;
      case 'operator':
        return branding.layoutConfigOperator;
      case 'user':
        return branding.layoutConfigUser;
      default:
        return null;
    }
  }, [branding, layoutRole]);

  // 레이아웃 설정 파싱
  const layoutConfig = useMemo<LayoutConfig>(() => {
    return parseLayoutConfigForRole(layoutConfigJson, layoutRole);
  }, [layoutConfigJson, layoutRole]);

  /**
   * 특정 컴포넌트가 활성화되어 있는지 확인
   */
  const isComponentEnabled = (category: keyof LayoutConfig, componentId: string): boolean => {
    const categoryConfig = layoutConfig[category];
    if (!categoryConfig || typeof categoryConfig !== 'object') return false;

    if (category === 'dashboard') {
      const dashboardConfig = categoryConfig as LayoutConfig['dashboard'];
      if (!dashboardConfig || !dashboardConfig.enabled) return false;
      const widget = dashboardConfig.widgets.find((w) => w.id === componentId);
      return widget?.enabled ?? false;
    }

    if (category === 'banner') {
      // 배너는 단순히 enabled 여부만 확인
      const bannerConfig = categoryConfig as BannerConfig;
      return bannerConfig?.enabled ?? false;
    }

    if (category === 'menu') {
      const menuConfig = categoryConfig as LayoutConfig['menu'];
      if (!menuConfig) return false;
      const item = menuConfig.items.find((i) => i.id === componentId);
      return item?.enabled ?? false;
    }

    return false;
  };

  /**
   * 컴포넌트들을 순서대로 정렬하여 반환
   */
  const getSortedComponents = <T extends ComponentConfig>(
    components: T[] | undefined
  ): T[] => {
    if (!components) return [];
    return [...components]
      .filter((c) => c.enabled)
      .sort((a, b) => a.order - b.order);
  };

  /**
   * 대시보드 위젯 목록 (활성화되고 정렬된)
   */
  const dashboardWidgets = useMemo<WidgetConfig[]>(() => {
    if (!layoutConfig.dashboard?.enabled) return [];
    return getSortedComponents(layoutConfig.dashboard.widgets);
  }, [layoutConfig]);

  /**
   * 배너 설정 (단순화됨 - enabled, position, title, content)
   */
  const bannerConfig = useMemo<BannerConfig | undefined>(() => {
    return layoutConfig.banner;
  }, [layoutConfig]);

  /**
   * 메뉴 아이템 목록 (활성화되고 정렬된)
   */
  const menuItems = useMemo<MenuItemConfig[]>(() => {
    return getSortedComponents(layoutConfig.menu?.items);
  }, [layoutConfig]);

  /**
   * 현재 역할의 기본 레이아웃 설정
   */
  const defaultLayoutConfig = useMemo(() => {
    return DEFAULT_LAYOUTS_BY_ROLE[layoutRole];
  }, [layoutRole]);

  return {
    layoutConfig,
    layoutRole,
    isComponentEnabled,
    dashboardWidgets,
    bannerConfig,
    menuItems,
    defaultLayoutConfig,
  };
}
