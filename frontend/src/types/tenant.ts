// 테넌트 상태
export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';

// 공개 테넌트 정보 (회원가입용)
export interface PublicTenant {
  code: string;
  name: string;
}

// 기본 테넌트 정보
export interface Tenant {
  id: number;
  code: string;
  name: string;
  domain: string | null;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

// 테넌트 브랜딩 설정
export interface TenantBranding {
  tenantId: number;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerBgColor: string;
  headerTextColor: string;
  sidebarBgColor: string;
  sidebarTextColor: string;
  sidebarActiveColor: string;
  sidebarActiveTextColor: string;
  buttonPrimaryBgColor: string;
  buttonPrimaryTextColor: string;
  buttonSecondaryBgColor: string;
  buttonSecondaryTextColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontUrl: string | null;
  customCss: string | null;
  layoutConfig: string | null;
  layoutConfigTenantAdmin: string | null;
  layoutConfigOperator: string | null;
  layoutConfigUser: string | null;
  bannerConfig: string | null; // 테넌트 공통 배너 설정 (JSON)
}

// 테넌트 설정 (기능 ON/OFF)
export interface TenantSettings {
  tenantId: number;
  courseEnabled: boolean;
  enrollmentEnabled: boolean;
  applicationEnabled: boolean;
  dashboardEnabled: boolean;
  instructorManagementEnabled: boolean;
  studentManagementEnabled: boolean;
  reportEnabled: boolean;
  notificationEnabled: boolean;
  menuVisibility: string | null;
  componentOrder: string | null;
  maxUsersLimit: number;
  maxCoursesLimit: number;
  sessionTimeoutMinutes: number;
  defaultLanguage: string;
  timezone: string;
}

// 테넌트 라벨 설정
export interface TenantLabels {
  tenantId: number;
  courseLabel: string;
  termLabel: string;
  studentLabel: string;
  instructorLabel: string;
  enrollmentLabel: string;
  applicationLabel: string;
  dashboardLabel: string;
  platformName: string;
  customLabels: string | null;
}

// 테넌트 상세 정보 (브랜딩, 설정 포함)
export interface TenantDetail extends Tenant {
  branding: TenantBranding | null;
  settings: TenantSettings | null;
}

// Request DTOs
export interface CreateTenantRequest {
  code: string;
  name: string;
  domain?: string;
}

export interface UpdateTenantRequest {
  name?: string;
  domain?: string;
}

export interface UpdateTenantBrandingRequest {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  sidebarBgColor?: string;
  sidebarTextColor?: string;
  sidebarActiveColor?: string;
  sidebarActiveTextColor?: string;
  buttonPrimaryBgColor?: string;
  buttonPrimaryTextColor?: string;
  buttonSecondaryBgColor?: string;
  buttonSecondaryTextColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontUrl?: string;
  customCss?: string;
  layoutConfig?: string;
  layoutConfigTenantAdmin?: string;
  layoutConfigOperator?: string;
  layoutConfigUser?: string;
  bannerConfig?: string;
}

export interface UpdateTenantSettingsRequest {
  courseEnabled?: boolean;
  enrollmentEnabled?: boolean;
  applicationEnabled?: boolean;
  dashboardEnabled?: boolean;
  instructorManagementEnabled?: boolean;
  studentManagementEnabled?: boolean;
  reportEnabled?: boolean;
  notificationEnabled?: boolean;
  menuVisibility?: string;
  componentOrder?: string;
  maxUsersLimit?: number;
  maxCoursesLimit?: number;
  sessionTimeoutMinutes?: number;
  defaultLanguage?: string;
  timezone?: string;
}

export interface UpdateTenantLabelsRequest {
  courseLabel?: string;
  termLabel?: string;
  studentLabel?: string;
  instructorLabel?: string;
  enrollmentLabel?: string;
  applicationLabel?: string;
  dashboardLabel?: string;
  platformName?: string;
  customLabels?: string;
}

// 기본 브랜딩 값
export const DEFAULT_BRANDING: TenantBranding = {
  tenantId: 0,
  logoUrl: null,
  faviconUrl: null,
  primaryColor: '#3B82F6',
  secondaryColor: '#6B7280',
  accentColor: '#8B5CF6',
  headerBgColor: '#FFFFFF',
  headerTextColor: '#111827',
  sidebarBgColor: '#F9FAFB',
  sidebarTextColor: '#374151',
  sidebarActiveColor: '#EFF6FF',
  sidebarActiveTextColor: '#3B82F6',
  buttonPrimaryBgColor: '#3B82F6',
  buttonPrimaryTextColor: '#FFFFFF',
  buttonSecondaryBgColor: '#F3F4F6',
  buttonSecondaryTextColor: '#374151',
  backgroundColor: '',
  fontFamily: 'Pretendard, -apple-system, sans-serif',
  fontUrl: null,
  customCss: null,
  layoutConfig: null,
  layoutConfigTenantAdmin: null,
  layoutConfigOperator: null,
  layoutConfigUser: null,
  bannerConfig: null,
};

// 기본 라벨 값
export const DEFAULT_LABELS: TenantLabels = {
  tenantId: 0,
  courseLabel: '강의',
  termLabel: '차수',
  studentLabel: '수강생',
  instructorLabel: '강사',
  enrollmentLabel: '수강신청',
  applicationLabel: '신청',
  dashboardLabel: '대시보드',
  platformName: 'Learning Platform',
  customLabels: null,
};
