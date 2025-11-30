import { apiClient } from './client';
import type {
  CreateTenantApplicationRequest,
  TenantApplicationResponse,
  ApproveApplicationRequest,
  RejectApplicationRequest,
  ApplicationStatus,
} from '../types/tenantApplication';

/**
 * 테넌트 신청 생성 (비회원)
 */
export const createTenantApplication = async (
  request: CreateTenantApplicationRequest
): Promise<TenantApplicationResponse> => {
  const response = await apiClient.post<TenantApplicationResponse>(
    '/tenant-applications',
    request
  );
  return response.data;
};

/**
 * 모든 신청 목록 조회 (SUPER_ADMIN)
 */
export const getAllTenantApplications = async (): Promise<TenantApplicationResponse[]> => {
  const response = await apiClient.get<TenantApplicationResponse[]>('/tenant-applications');
  return response.data;
};

/**
 * 대기 중인 신청 목록 조회 (SUPER_ADMIN)
 */
export const getPendingTenantApplications = async (): Promise<TenantApplicationResponse[]> => {
  const response = await apiClient.get<TenantApplicationResponse[]>('/tenant-applications/pending');
  return response.data;
};

/**
 * 상태별 신청 목록 조회 (SUPER_ADMIN)
 */
export const getTenantApplicationsByStatus = async (
  status: ApplicationStatus
): Promise<TenantApplicationResponse[]> => {
  const response = await apiClient.get<TenantApplicationResponse[]>(
    `/tenant-applications/status/${status}`
  );
  return response.data;
};

/**
 * 신청 상세 조회 (SUPER_ADMIN)
 */
export const getTenantApplication = async (id: number): Promise<TenantApplicationResponse> => {
  const response = await apiClient.get<TenantApplicationResponse>(`/tenant-applications/${id}`);
  return response.data;
};

/**
 * 신청 승인 (SUPER_ADMIN)
 */
export const approveTenantApplication = async (
  id: number,
  request: ApproveApplicationRequest
): Promise<TenantApplicationResponse> => {
  const response = await apiClient.post<TenantApplicationResponse>(
    `/tenant-applications/${id}/approve`,
    request
  );
  return response.data;
};

/**
 * 신청 거절 (SUPER_ADMIN)
 */
export const rejectTenantApplication = async (
  id: number,
  request: RejectApplicationRequest
): Promise<TenantApplicationResponse> => {
  const response = await apiClient.post<TenantApplicationResponse>(
    `/tenant-applications/${id}/reject`,
    request
  );
  return response.data;
};
