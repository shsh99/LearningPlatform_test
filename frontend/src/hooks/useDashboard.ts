import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import * as dashboardApi from '../api/dashboard';

/**
 * 슈퍼 관리자 대시보드 조회 Hook
 */
export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.superAdmin(),
    queryFn: dashboardApi.getSuperAdminDashboardStats,
    staleTime: 1 * 60 * 1000, // 1분 (대시보드는 자주 갱신)
  });
}

/**
 * 테넌트 관리자 대시보드 조회 Hook
 */
export function useTenantAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.tenantAdmin(),
    queryFn: dashboardApi.getTenantAdminDashboardStats,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * 일반 사용자 대시보드 조회 Hook
 */
export function useUserDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.user(),
    queryFn: dashboardApi.getDashboardStats,
    staleTime: 1 * 60 * 1000,
  });
}
