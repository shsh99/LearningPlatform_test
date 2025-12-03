import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import * as termRequestApi from '../api/courseTermRequest';
import type {
  CreateChangeRequestDto,
  CreateDeleteRequestDto,
  RejectRequestDto,
  TermRequestStatus,
  TermRequestType,
} from '../types/courseTermRequest';

// ===== 변경 요청 Hooks (TS-015) =====

/**
 * 내 변경 요청 목록 조회 Hook
 */
export function useMyChangeRequests() {
  return useQuery({
    queryKey: queryKeys.termRequests.myChange(),
    queryFn: termRequestApi.getMyChangeRequests,
  });
}

/**
 * 변경 요청 상세 조회 Hook
 */
export function useChangeRequestDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.termRequests.changeDetail(id),
    queryFn: () => termRequestApi.getChangeRequestDetail(id),
    enabled: !!id,
  });
}

/**
 * 변경 요청 생성 Mutation Hook
 */
export function useCreateChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChangeRequestDto) => termRequestApi.createChangeRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.myChange() });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
    },
  });
}

/**
 * 변경 요청 취소 Mutation Hook
 */
export function useCancelChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => termRequestApi.cancelChangeRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.myChange() });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
    },
  });
}

// ===== 삭제 요청 Hooks (TS-016) =====

/**
 * 내 삭제 요청 목록 조회 Hook
 */
export function useMyDeleteRequests() {
  return useQuery({
    queryKey: queryKeys.termRequests.myDelete(),
    queryFn: termRequestApi.getMyDeleteRequests,
  });
}

/**
 * 삭제 요청 상세 조회 Hook
 */
export function useDeleteRequestDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.termRequests.deleteDetail(id),
    queryFn: () => termRequestApi.getDeleteRequestDetail(id),
    enabled: !!id,
  });
}

/**
 * 삭제 요청 생성 Mutation Hook
 */
export function useCreateDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeleteRequestDto) => termRequestApi.createDeleteRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.myDelete() });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
    },
  });
}

/**
 * 삭제 요청 취소 Mutation Hook
 */
export function useCancelDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => termRequestApi.cancelDeleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.myDelete() });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
    },
  });
}

// ===== Admin 요청 관리 Hooks (TS-017) =====

/**
 * 전체 요청 목록 조회 Hook
 */
export function useTermRequests(
  status: TermRequestStatus = 'PENDING',
  type?: TermRequestType
) {
  return useQuery({
    queryKey: queryKeys.termRequests.list(status, type),
    queryFn: () => termRequestApi.getAllTermRequests(status, type),
  });
}

/**
 * 변경 요청 승인 Mutation Hook
 */
export function useApproveChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => termRequestApi.approveChangeRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.changeDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
      // 차수 정보도 변경됨
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.all });
    },
  });
}

/**
 * 변경 요청 반려 Mutation Hook
 */
export function useRejectChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RejectRequestDto }) =>
      termRequestApi.rejectChangeRequest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.changeDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
    },
  });
}

/**
 * 삭제 요청 승인 Mutation Hook
 */
export function useApproveDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => termRequestApi.approveDeleteRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.deleteDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
      // 차수 정보도 변경됨 (취소됨)
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.all });
    },
  });
}

/**
 * 삭제 요청 반려 Mutation Hook
 */
export function useRejectDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RejectRequestDto }) =>
      termRequestApi.rejectDeleteRequest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.deleteDetail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.termRequests.lists() });
    },
  });
}
