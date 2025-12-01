import { apiClient } from './client';
import type {
  Tenant,
  TenantDetail,
  TenantBranding,
  TenantSettings,
  TenantLabels,
  PublicTenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  UpdateTenantBrandingRequest,
  UpdateTenantSettingsRequest,
  UpdateTenantLabelsRequest,
} from '../types/tenant';

// ===== 공개 API (인증 불필요, URL 기반 테넌트) =====

/**
 * 활성화된 테넌트 목록 조회 (공개, 회원가입용)
 */
export const getPublicTenantList = async (): Promise<PublicTenant[]> => {
  const response = await apiClient.get<PublicTenant[]>('/public/tenant/list');
  return response.data;
};

/**
 * 테넌트 코드로 브랜딩 정보 조회 (공개)
 */
export const getPublicTenantBranding = async (code: string): Promise<TenantBranding> => {
  const response = await apiClient.get<TenantBranding>(`/public/tenant/${code}/branding`);
  return response.data;
};

/**
 * 테넌트 코드로 라벨 정보 조회 (공개)
 */
export const getPublicTenantLabels = async (code: string): Promise<TenantLabels> => {
  const response = await apiClient.get<TenantLabels>(`/public/tenant/${code}/labels`);
  return response.data;
};

/**
 * 테넌트 코드 존재 여부 확인 (공개)
 */
export const checkTenantExists = async (code: string): Promise<boolean> => {
  const response = await apiClient.get<boolean>(`/public/tenant/${code}/exists`);
  return response.data;
};

// ===== 현재 테넌트 API (모든 사용자) =====

/**
 * 현재 테넌트 전체 정보 조회
 */
export const getCurrentTenant = async (): Promise<TenantDetail> => {
  const response = await apiClient.get<TenantDetail>('/tenant');
  return response.data;
};

/**
 * 현재 테넌트 브랜딩 정보 조회
 */
export const getCurrentTenantBranding = async (): Promise<TenantBranding> => {
  const response = await apiClient.get<TenantBranding>('/tenant/branding');
  return response.data;
};

/**
 * 현재 테넌트 설정 정보 조회
 */
export const getCurrentTenantSettings = async (): Promise<TenantSettings> => {
  const response = await apiClient.get<TenantSettings>('/tenant/settings');
  return response.data;
};

/**
 * 현재 테넌트 라벨 정보 조회
 */
export const getCurrentTenantLabels = async (): Promise<TenantLabels> => {
  const response = await apiClient.get<TenantLabels>('/tenant/labels');
  return response.data;
};

// ===== 테넌트 관리 API (SUPER_ADMIN 전용) =====

/**
 * 테넌트 생성
 */
export const createTenant = async (request: CreateTenantRequest): Promise<Tenant> => {
  const response = await apiClient.post<Tenant>('/tenants', request);
  return response.data;
};

/**
 * 모든 테넌트 조회
 */
export const getAllTenants = async (): Promise<Tenant[]> => {
  const response = await apiClient.get<Tenant[]>('/tenants');
  return response.data;
};

/**
 * 활성 테넌트만 조회
 */
export const getActiveTenants = async (): Promise<Tenant[]> => {
  const response = await apiClient.get<Tenant[]>('/tenants/active');
  return response.data;
};

/**
 * 테넌트 상세 조회
 */
export const getTenant = async (tenantId: number): Promise<TenantDetail> => {
  const response = await apiClient.get<TenantDetail>(`/tenants/${tenantId}`);
  return response.data;
};

/**
 * 테넌트 코드로 조회
 */
export const getTenantByCode = async (code: string): Promise<TenantDetail> => {
  const response = await apiClient.get<TenantDetail>(`/tenants/code/${code}`);
  return response.data;
};

/**
 * 테넌트 정보 수정
 */
export const updateTenant = async (tenantId: number, request: UpdateTenantRequest): Promise<Tenant> => {
  const response = await apiClient.put<Tenant>(`/tenants/${tenantId}`, request);
  return response.data;
};

/**
 * 테넌트 삭제
 */
export const deleteTenant = async (tenantId: number): Promise<void> => {
  await apiClient.delete(`/tenants/${tenantId}`);
};

/**
 * 테넌트 활성화
 */
export const activateTenant = async (tenantId: number): Promise<void> => {
  await apiClient.post(`/tenants/${tenantId}/activate`);
};

/**
 * 테넌트 비활성화
 */
export const deactivateTenant = async (tenantId: number): Promise<void> => {
  await apiClient.post(`/tenants/${tenantId}/deactivate`);
};

// ===== 브랜딩 관리 =====

/**
 * 테넌트 브랜딩 조회
 */
export const getTenantBranding = async (tenantId: number): Promise<TenantBranding> => {
  const response = await apiClient.get<TenantBranding>(`/tenants/${tenantId}/branding`);
  return response.data;
};

/**
 * 테넌트 브랜딩 수정
 */
export const updateTenantBranding = async (
  tenantId: number,
  request: UpdateTenantBrandingRequest
): Promise<TenantBranding> => {
  const response = await apiClient.put<TenantBranding>(`/tenants/${tenantId}/branding`, request);
  return response.data;
};

// ===== 설정 관리 =====

/**
 * 테넌트 설정 조회
 */
export const getTenantSettings = async (tenantId: number): Promise<TenantSettings> => {
  const response = await apiClient.get<TenantSettings>(`/tenants/${tenantId}/settings`);
  return response.data;
};

/**
 * 테넌트 설정 수정
 */
export const updateTenantSettings = async (
  tenantId: number,
  request: UpdateTenantSettingsRequest
): Promise<TenantSettings> => {
  const response = await apiClient.put<TenantSettings>(`/tenants/${tenantId}/settings`, request);
  return response.data;
};

// ===== 라벨 관리 =====

/**
 * 테넌트 라벨 조회
 */
export const getTenantLabels = async (tenantId: number): Promise<TenantLabels> => {
  const response = await apiClient.get<TenantLabels>(`/tenants/${tenantId}/labels`);
  return response.data;
};

/**
 * 테넌트 라벨 수정
 */
export const updateTenantLabels = async (
  tenantId: number,
  request: UpdateTenantLabelsRequest
): Promise<TenantLabels> => {
  const response = await apiClient.put<TenantLabels>(`/tenants/${tenantId}/labels`, request);
  return response.data;
};
