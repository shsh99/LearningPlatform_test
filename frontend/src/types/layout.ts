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
 * 개별 배너 슬라이드 아이템
 */
export interface BannerSlide {
  id: string;
  enabled: boolean;
  order: number;
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * 배너 영역 설정 (상단 또는 하단)
 */
export interface BannerAreaConfig {
  enabled: boolean;
  slides: BannerSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number; // milliseconds
  showArrows?: boolean;
  showDots?: boolean;
}

/**
 * 테넌트 공통 배너 설정 (모든 사용자에게 적용)
 */
export interface TenantBannerConfig {
  top?: BannerAreaConfig;
  bottom?: BannerAreaConfig;
}

/**
 * 배너 설정 (하위 호환성 유지)
 * @deprecated Use TenantBannerConfig instead
 */
export interface BannerConfig {
  enabled: boolean;
  position: 'top' | 'bottom';
  title?: string;
  content?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * 기본 배너 영역 설정
 */
export const DEFAULT_BANNER_AREA: BannerAreaConfig = {
  enabled: false,
  slides: [],
  autoPlay: true,
  autoPlayInterval: 5000,
  showArrows: true,
  showDots: true,
};

/**
 * 기본 테넌트 배너 설정
 */
export const DEFAULT_TENANT_BANNER: TenantBannerConfig = {
  top: { ...DEFAULT_BANNER_AREA },
  bottom: { ...DEFAULT_BANNER_AREA },
};

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
  // 배너 설정 (단순화)
  banner?: BannerConfig;
  // 메뉴 설정
  menu?: {
    items: MenuItemConfig[];
  };
}

/**
 * 역할 타입 (레이아웃 설정용)
 */
export type LayoutRole = 'superAdmin' | 'tenantAdmin' | 'operator' | 'user';

/**
 * 역할별 레이아웃 설정 키 매핑
 */
export const LAYOUT_CONFIG_KEYS: Record<LayoutRole, string> = {
  superAdmin: 'layoutConfigSuperAdmin',
  tenantAdmin: 'layoutConfigTenantAdmin',
  operator: 'layoutConfigOperator',
  user: 'layoutConfigUser',
};

/**
 * 역할별 표시 이름
 */
export const LAYOUT_ROLE_LABELS: Record<LayoutRole, string> = {
  superAdmin: '슈퍼 관리자',
  tenantAdmin: '테넌트 관리자',
  operator: '운영자',
  user: '일반 사용자',
};

/**
 * 역할별 설명
 */
export const LAYOUT_ROLE_DESCRIPTIONS: Record<LayoutRole, string> = {
  superAdmin: '슈퍼 관리자가 보는 페이지 레이아웃을 설정합니다',
  tenantAdmin: '테넌트 관리자가 보는 페이지 레이아웃을 설정합니다',
  operator: '운영자가 보는 페이지 레이아웃을 설정합니다',
  user: '일반 사용자가 보는 페이지 레이아웃을 설정합니다',
};

/**
 * 기본 레이아웃 설정 (USER 기본값과 동일)
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  dashboard: {
    enabled: true,
    widgets: [
      { id: 'myCourses', enabled: true, order: 1, label: '내 강의' },
      { id: 'mySchedule', enabled: true, order: 2, label: '내 일정' },
      { id: 'announcements', enabled: true, order: 3, label: '공지사항' },
    ],
  },
  banner: {
    enabled: false,
    position: 'top',
    title: '',
    content: '',
  },
  menu: {
    items: [
      { id: 'courses', enabled: true, order: 1, label: '강의 탐색', icon: 'book', path: '/courses' },
      { id: 'myLearning', enabled: true, order: 2, label: '내 강의실', icon: 'school', path: '/my-learning' },
      { id: 'myAssignedCourses', enabled: true, order: 3, label: '담당 강의', icon: 'assignment', path: '/my-assigned-courses' },
      { id: 'myProfile', enabled: true, order: 4, label: '마이페이지', icon: 'person', path: '/my-profile' },
    ],
  },
};

/**
 * 슈퍼 관리자용 기본 레이아웃 설정
 */
export const DEFAULT_SUPER_ADMIN_LAYOUT: LayoutConfig = {
  dashboard: {
    enabled: true,
    widgets: [
      { id: 'systemStats', enabled: true, order: 1, label: '시스템 통계' },
      { id: 'tenantOverview', enabled: true, order: 2, label: '테넌트 현황' },
      { id: 'recentApplications', enabled: true, order: 3, label: '최근 신청' },
    ],
  },
  banner: {
    enabled: false,
    position: 'top',
    title: '',
    content: '',
  },
  menu: {
    items: [
      { id: 'dashboard', enabled: true, order: 1, label: '대시보드', icon: 'dashboard', path: '/super-admin/dashboard' },
      { id: 'tenants', enabled: true, order: 2, label: '테넌트 관리', icon: 'people', path: '/super-admin/tenants' },
      { id: 'applications', enabled: true, order: 3, label: '신청 관리', icon: 'assignment', path: '/super-admin/applications' },
      { id: 'notices', enabled: true, order: 4, label: '공지 관리', icon: 'notifications', path: '/super-admin/notices' },
      { id: 'createTenantAdmin', enabled: true, order: 5, label: '관리자 생성', icon: 'person', path: '/super-admin/create-tenant-admin' },
    ],
  },
};

/**
 * 테넌트 관리자용 기본 레이아웃 설정
 */
export const DEFAULT_TENANT_ADMIN_LAYOUT: LayoutConfig = {
  dashboard: {
    enabled: true,
    widgets: [
      { id: 'tenantStats', enabled: true, order: 1, label: '테넌트 통계' },
      { id: 'userManagement', enabled: true, order: 2, label: '사용자 관리' },
      { id: 'courseOverview', enabled: true, order: 3, label: '코스 개요' },
    ],
  },
  banner: {
    enabled: false,
    position: 'top',
    title: '',
    content: '',
  },
  menu: {
    items: [
      { id: 'dashboard', enabled: true, order: 1, label: '대시보드', icon: 'dashboard', path: '/tenant-admin/dashboard' },
      { id: 'branding', enabled: true, order: 2, label: '브랜딩 설정', icon: 'palette', path: '/tenant-admin/branding' },
      { id: 'layout', enabled: true, order: 3, label: '레이아웃 설정', icon: 'layout', path: '/tenant-admin/layout' },
      { id: 'notices', enabled: true, order: 4, label: '공지 관리', icon: 'notifications', path: '/tenant-admin/notices' },
      { id: 'operators', enabled: true, order: 5, label: '운영자 관리', icon: 'people', path: '/tenant-admin/operators' },
    ],
  },
};

/**
 * 운영자용 기본 레이아웃 설정
 */
export const DEFAULT_OPERATOR_LAYOUT: LayoutConfig = {
  dashboard: {
    enabled: true,
    widgets: [
      { id: 'stats', enabled: true, order: 1, label: '통계' },
      { id: 'termCalendar', enabled: true, order: 2, label: '차수 캘린더' },
      { id: 'instructorStats', enabled: true, order: 3, label: '강사 현황' },
    ],
  },
  banner: {
    enabled: false,
    position: 'top',
    title: '',
    content: '',
  },
  menu: {
    items: [
      { id: 'dashboard', enabled: true, order: 1, label: '대시보드', icon: 'dashboard', path: '/operator/dashboard' },
      { id: 'terms', enabled: true, order: 2, label: '차수 관리', icon: 'calendar', path: '/operator/terms' },
      { id: 'assignments', enabled: true, order: 3, label: '강사 배정', icon: 'school', path: '/operator/assignments' },
      { id: 'iis', enabled: true, order: 4, label: 'IIS 조회', icon: 'assignment', path: '/ts/iis' },
      { id: 'sis', enabled: true, order: 5, label: 'SIS 조회', icon: 'people', path: '/enrollment/sis' },
    ],
  },
};

/**
 * 일반 사용자용 기본 레이아웃 설정
 */
export const DEFAULT_USER_LAYOUT: LayoutConfig = {
  dashboard: {
    enabled: true,
    widgets: [
      { id: 'myCourses', enabled: true, order: 1, label: '내 강의' },
      { id: 'mySchedule', enabled: true, order: 2, label: '내 일정' },
      { id: 'announcements', enabled: true, order: 3, label: '공지사항' },
    ],
  },
  banner: {
    enabled: false,
    position: 'top',
    title: '',
    content: '',
  },
  menu: {
    items: [
      { id: 'courses', enabled: true, order: 1, label: '강의 탐색', icon: 'book', path: '/courses' },
      { id: 'myLearning', enabled: true, order: 2, label: '내 강의실', icon: 'school', path: '/my-learning' },
      { id: 'myEnrollments', enabled: true, order: 3, label: '수강 현황', icon: 'assignment', path: '/my-enrollments' },
      { id: 'myAssignedCourses', enabled: true, order: 4, label: '담당 강의', icon: 'calendar', path: '/my-assigned-courses' },
      { id: 'myProfile', enabled: true, order: 5, label: '마이페이지', icon: 'person', path: '/my-profile' },
    ],
  },
};

/**
 * 역할별 기본 레이아웃 설정 매핑
 */
export const DEFAULT_LAYOUTS_BY_ROLE: Record<LayoutRole, LayoutConfig> = {
  superAdmin: DEFAULT_SUPER_ADMIN_LAYOUT,
  tenantAdmin: DEFAULT_TENANT_ADMIN_LAYOUT,
  operator: DEFAULT_OPERATOR_LAYOUT,
  user: DEFAULT_USER_LAYOUT,
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

/**
 * 역할별 JSON 문자열을 레이아웃 설정으로 파싱
 */
export function parseLayoutConfigForRole(
  json: string | null | undefined,
  role: LayoutRole
): LayoutConfig {
  const defaultConfig = DEFAULT_LAYOUTS_BY_ROLE[role];

  if (!json) return defaultConfig;

  try {
    const parsed = JSON.parse(json);
    return {
      ...defaultConfig,
      ...parsed,
      dashboard: {
        ...defaultConfig.dashboard,
        ...parsed.dashboard,
      },
      banner: {
        ...defaultConfig.banner,
        ...parsed.banner,
      },
      menu: {
        ...defaultConfig.menu,
        ...parsed.menu,
      },
    };
  } catch (error) {
    console.error(`Failed to parse layout config for role ${role}:`, error);
    return defaultConfig;
  }
}
