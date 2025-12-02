import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import type {
  LayoutConfig,
  ComponentConfig,
  WidgetConfig,
  BannerItemConfig,
  MenuItemConfig,
} from '../types/layout';
import { parseLayoutConfig } from '../types/layout';

/**
 * 레이아웃 설정을 관리하는 Hook
 */
export function useLayout() {
  const { tenant } = useTenant();

  // layoutConfig를 파싱하여 사용
  const layoutConfig = useMemo<LayoutConfig>(() => {
    return parseLayoutConfig(tenant?.branding?.layoutConfig);
  }, [tenant]);

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
      const bannerConfig = categoryConfig as LayoutConfig['banner'];
      if (!bannerConfig || !bannerConfig.enabled) return false;
      const item = bannerConfig.items.find((i) => i.id === componentId);
      return item?.enabled ?? false;
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
   * 배너 아이템 목록 (활성화되고 정렬된)
   */
  const bannerItems = useMemo<BannerItemConfig[]>(() => {
    if (!layoutConfig.banner?.enabled) return [];
    return getSortedComponents(layoutConfig.banner.items);
  }, [layoutConfig]);

  /**
   * 메뉴 아이템 목록 (활성화되고 정렬된)
   */
  const menuItems = useMemo<MenuItemConfig[]>(() => {
    return getSortedComponents(layoutConfig.menu?.items);
  }, [layoutConfig]);

  /**
   * 특정 페이지의 컴포넌트 목록
   */
  const getPageComponents = (pageName: string): ComponentConfig[] => {
    const pageConfig = layoutConfig.pages?.[pageName];
    if (!pageConfig?.enabled) return [];
    return getSortedComponents(pageConfig.components);
  };

  return {
    layoutConfig,
    isComponentEnabled,
    dashboardWidgets,
    bannerItems,
    menuItems,
    getPageComponents,
  };
}
