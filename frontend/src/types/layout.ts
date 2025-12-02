/**
 * 레이아웃 컴포넌트 설정
 */
export interface ComponentConfig {
  id: string;
  enabled: boolean;
  order: number;
  label?: string;
}

/**
 * 위젯 설정 (대시보드 등에서 사용)
 */
export interface WidgetConfig extends ComponentConfig {
  size?: 'small' | 'medium' | 'large';
  position?: { x: number; y: number };
}

/**
 * 배너 아이템 설정
 */
export interface BannerItemConfig extends ComponentConfig {
  type?: 'hero' | 'feature' | 'announcement' | 'custom';
}

/**
 * 메뉴 아이템 설정
 */
export interface MenuItemConfig extends ComponentConfig {
  icon?: string;
  path?: string;
}

/**
 * 전체 레이아웃 설정
 */
export interface LayoutConfig {
  // 대시보드 위젯
  dashboard?: {
    enabled: boolean;
    widgets: WidgetConfig[];
  };
  // 배너 설정
  banner?: {
    enabled: boolean;
    position: 'top' | 'bottom';
    items: BannerItemConfig[];
  };
  // 메뉴 설정
  menu?: {
    items: MenuItemConfig[];
  };
  // 페이지별 컴포넌트 설정
  pages?: {
    [pageName: string]: {
      enabled: boolean;
      components: ComponentConfig[];
    };
  };
}

/**
 * 기본 레이아웃 설정
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  dashboard: {
    enabled: true,
    widgets: [
      { id: 'stats', enabled: true, order: 1, label: '통계' },
      { id: 'recentCourses', enabled: true, order: 2, label: '최근 코스' },
      { id: 'announcements', enabled: true, order: 3, label: '공지사항' },
      { id: 'calendar', enabled: true, order: 4, label: '캘린더' },
    ],
  },
  banner: {
    enabled: true,
    position: 'top',
    items: [
      { id: 'hero', enabled: true, order: 1, label: '히어로 배너', type: 'hero' },
      { id: 'features', enabled: true, order: 2, label: '기능 소개', type: 'feature' },
    ],
  },
  menu: {
    items: [
      { id: 'dashboard', enabled: true, order: 1, label: '대시보드', icon: 'dashboard', path: '/dashboard' },
      { id: 'courses', enabled: true, order: 2, label: '코스', icon: 'book', path: '/courses' },
      { id: 'enrollments', enabled: true, order: 3, label: '수강신청', icon: 'assignment', path: '/enrollments' },
      { id: 'users', enabled: true, order: 4, label: '사용자', icon: 'people', path: '/users' },
      { id: 'settings', enabled: true, order: 5, label: '설정', icon: 'settings', path: '/settings' },
    ],
  },
};

/**
 * 레이아웃 설정을 JSON 문자열로 변환
 */
export function layoutConfigToJson(config: LayoutConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * JSON 문자열을 레이아웃 설정으로 파싱
 */
export function parseLayoutConfig(json: string | null | undefined): LayoutConfig {
  if (!json) return DEFAULT_LAYOUT_CONFIG;

  try {
    const parsed = JSON.parse(json);
    // 기본 설정과 병합하여 누락된 필드 보완
    return {
      ...DEFAULT_LAYOUT_CONFIG,
      ...parsed,
      dashboard: {
        ...DEFAULT_LAYOUT_CONFIG.dashboard,
        ...parsed.dashboard,
      },
      banner: {
        ...DEFAULT_LAYOUT_CONFIG.banner,
        ...parsed.banner,
      },
      menu: {
        ...DEFAULT_LAYOUT_CONFIG.menu,
        ...parsed.menu,
      },
    };
  } catch (error) {
    console.error('Failed to parse layout config:', error);
    return DEFAULT_LAYOUT_CONFIG;
  }
}
