import { apiClient } from './client';
import type {
  Notice,
  NoticePage,
  CreateNoticeRequest,
  UpdateNoticeRequest,
} from '../types/notice';

/**
 * Notice API 클라이언트
 */

// ==================== 관리자 API ====================

// 공지 생성
export const createNotice = async (data: CreateNoticeRequest): Promise<Notice> => {
  const response = await apiClient.post<Notice>('/notices', data);
  return response.data;
};

// 공지 단건 조회
export const getNoticeById = async (id: number): Promise<Notice> => {
  const response = await apiClient.get<Notice>(`/notices/${id}`);
  return response.data;
};

// 시스템 공지 목록 조회 (SUPER_ADMIN 관리용)
export const getSystemNotices = async (page = 0, size = 20): Promise<NoticePage> => {
  const response = await apiClient.get<NoticePage>('/notices/system', {
    params: { page, size },
  });
  return response.data;
};

// 테넌트 공지 목록 조회 (TENANT_ADMIN 관리용)
export const getTenantNotices = async (page = 0, size = 20): Promise<NoticePage> => {
  const response = await apiClient.get<NoticePage>('/notices/tenant', {
    params: { page, size },
  });
  return response.data;
};

// 공지 수정
export const updateNotice = async (id: number, data: UpdateNoticeRequest): Promise<Notice> => {
  const response = await apiClient.patch<Notice>(`/notices/${id}`, data);
  return response.data;
};

// 공지 활성화
export const enableNotice = async (id: number): Promise<Notice> => {
  const response = await apiClient.post<Notice>(`/notices/${id}/enable`);
  return response.data;
};

// 공지 비활성화
export const disableNotice = async (id: number): Promise<Notice> => {
  const response = await apiClient.post<Notice>(`/notices/${id}/disable`);
  return response.data;
};

// 공지 삭제
export const deleteNotice = async (id: number): Promise<void> => {
  await apiClient.delete(`/notices/${id}`);
};

// ==================== 사용자 API (활성 공지 조회) ====================

// 현재 활성화된 시스템 공지 조회 (TENANT_ADMIN에게 표시)
export const getActiveSystemNotices = async (): Promise<Notice[]> => {
  const response = await apiClient.get<Notice[]>('/notices/active/system');
  return response.data;
};

// 현재 활성화된 테넌트 공지 조회 (테넌트 사용자에게 표시)
export const getActiveTenantNotices = async (): Promise<Notice[]> => {
  const response = await apiClient.get<Notice[]>('/notices/active/tenant');
  return response.data;
};
