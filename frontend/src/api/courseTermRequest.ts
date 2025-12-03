import { apiClient } from './client';
import type {
  CreateChangeRequestDto,
  CreateDeleteRequestDto,
  RejectRequestDto,
  ChangeRequestResponse,
  DeleteRequestResponse,
  TermRequestListResponse,
  TermRequestStatus,
  TermRequestType,
} from '../types/courseTermRequest';

// ===== 변경 요청 API (TS-015) =====

/**
 * 변경 요청 생성
 */
export const createChangeRequest = async (
  request: CreateChangeRequestDto
): Promise<ChangeRequestResponse> => {
  const response = await apiClient.post<ChangeRequestResponse>(
    '/course-term-requests/change',
    request
  );
  return response.data;
};

/**
 * 내 변경 요청 목록 조회
 */
export const getMyChangeRequests = async (): Promise<ChangeRequestResponse[]> => {
  const response = await apiClient.get<ChangeRequestResponse[]>(
    '/course-term-requests/change/my'
  );
  return response.data;
};

/**
 * 변경 요청 취소
 */
export const cancelChangeRequest = async (id: number): Promise<void> => {
  await apiClient.delete(`/course-term-requests/change/${id}`);
};

// ===== 삭제 요청 API (TS-016) =====

/**
 * 삭제 요청 생성
 */
export const createDeleteRequest = async (
  request: CreateDeleteRequestDto
): Promise<DeleteRequestResponse> => {
  const response = await apiClient.post<DeleteRequestResponse>(
    '/course-term-requests/delete',
    request
  );
  return response.data;
};

/**
 * 내 삭제 요청 목록 조회
 */
export const getMyDeleteRequests = async (): Promise<DeleteRequestResponse[]> => {
  const response = await apiClient.get<DeleteRequestResponse[]>(
    '/course-term-requests/delete/my'
  );
  return response.data;
};

/**
 * 삭제 요청 취소
 */
export const cancelDeleteRequest = async (id: number): Promise<void> => {
  await apiClient.delete(`/course-term-requests/delete/${id}`);
};

// ===== Admin 요청 관리 API (TS-017) =====

/**
 * 요청 목록 조회 (변경+삭제 통합)
 */
export const getAllTermRequests = async (
  status: TermRequestStatus = 'PENDING',
  type?: TermRequestType
): Promise<TermRequestListResponse[]> => {
  const response = await apiClient.get<TermRequestListResponse[]>(
    '/course-term-requests',
    { params: { status, type } }
  );
  return response.data;
};

/**
 * 변경 요청 상세 조회
 */
export const getChangeRequestDetail = async (
  id: number
): Promise<ChangeRequestResponse> => {
  const response = await apiClient.get<ChangeRequestResponse>(
    `/course-term-requests/change/${id}`
  );
  return response.data;
};

/**
 * 삭제 요청 상세 조회
 */
export const getDeleteRequestDetail = async (
  id: number
): Promise<DeleteRequestResponse> => {
  const response = await apiClient.get<DeleteRequestResponse>(
    `/course-term-requests/delete/${id}`
  );
  return response.data;
};

/**
 * 변경 요청 승인
 */
export const approveChangeRequest = async (
  id: number
): Promise<ChangeRequestResponse> => {
  const response = await apiClient.patch<ChangeRequestResponse>(
    `/course-term-requests/change/${id}/approve`
  );
  return response.data;
};

/**
 * 변경 요청 반려
 */
export const rejectChangeRequest = async (
  id: number,
  request: RejectRequestDto
): Promise<ChangeRequestResponse> => {
  const response = await apiClient.patch<ChangeRequestResponse>(
    `/course-term-requests/change/${id}/reject`,
    request
  );
  return response.data;
};

/**
 * 삭제 요청 승인
 */
export const approveDeleteRequest = async (
  id: number
): Promise<DeleteRequestResponse> => {
  const response = await apiClient.patch<DeleteRequestResponse>(
    `/course-term-requests/delete/${id}/approve`
  );
  return response.data;
};

/**
 * 삭제 요청 반려
 */
export const rejectDeleteRequest = async (
  id: number,
  request: RejectRequestDto
): Promise<DeleteRequestResponse> => {
  const response = await apiClient.patch<DeleteRequestResponse>(
    `/course-term-requests/delete/${id}/reject`,
    request
  );
  return response.data;
};
