import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import * as noticeApi from '../api/notice';
import type { CreateNoticeRequest, UpdateNoticeRequest } from '../types/notice';

/**
 * 시스템 공지 목록 조회 Hook (SUPER_ADMIN 관리용)
 */
export function useSystemNotices(page = 0, size = 20) {
  return useQuery({
    queryKey: [...queryKeys.notices.system(), { page, size }],
    queryFn: () => noticeApi.getSystemNotices(page, size),
  });
}

/**
 * 테넌트 공지 목록 조회 Hook (TENANT_ADMIN 관리용)
 */
export function useTenantNotices(page = 0, size = 20) {
  return useQuery({
    queryKey: [...queryKeys.notices.tenant(), { page, size }],
    queryFn: () => noticeApi.getTenantNotices(page, size),
  });
}

/**
 * 활성 시스템 공지 조회 Hook (TENANT_ADMIN에게 표시)
 */
export function useActiveSystemNotices(enabled = true) {
  return useQuery({
    queryKey: queryKeys.notices.activeSystem(),
    queryFn: noticeApi.getActiveSystemNotices,
    enabled,
    staleTime: 0, // 항상 새로운 데이터 요청
    refetchOnWindowFocus: true, // 창 포커스 시 재요청
    refetchOnMount: true, // 컴포넌트 마운트 시 재요청
  });
}

/**
 * 활성 테넌트 공지 조회 Hook (테넌트 사용자에게 표시)
 */
export function useActiveTenantNotices(enabled = true) {
  return useQuery({
    queryKey: queryKeys.notices.activeTenant(),
    queryFn: noticeApi.getActiveTenantNotices,
    enabled,
    staleTime: 0, // 항상 새로운 데이터 요청
    refetchOnWindowFocus: true, // 창 포커스 시 재요청
    refetchOnMount: true, // 컴포넌트 마운트 시 재요청
  });
}

/**
 * 공지 단건 조회 Hook
 */
export function useNotice(id: number) {
  return useQuery({
    queryKey: queryKeys.notices.detail(id),
    queryFn: () => noticeApi.getNoticeById(id),
    enabled: !!id,
  });
}

/**
 * 공지 생성 Mutation Hook
 */
export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoticeRequest) => noticeApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.all });
    },
  });
}

/**
 * 공지 수정 Mutation Hook
 */
export function useUpdateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoticeRequest }) =>
      noticeApi.updateNotice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.lists() });
    },
  });
}

/**
 * 공지 활성화 Mutation Hook
 */
export function useEnableNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticeApi.enableNotice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.all });
    },
  });
}

/**
 * 공지 비활성화 Mutation Hook
 */
export function useDisableNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticeApi.disableNotice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.all });
    },
  });
}

/**
 * 공지 삭제 Mutation Hook
 */
export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticeApi.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.all });
    },
  });
}
