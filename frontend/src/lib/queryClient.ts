import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 staleTime: 5분
      staleTime: 5 * 60 * 1000,
      // 기본 gcTime (캐시 유지 시간): 30분
      gcTime: 30 * 60 * 1000,
      // 실패 시 재시도 횟수
      retry: 1,
      // 창이 포커스될 때 자동 refetch 비활성화
      refetchOnWindowFocus: false,
    },
    mutations: {
      // mutation 실패 시 재시도 안함
      retry: 0,
    },
  },
});

// Query Keys 상수
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },

  // Courses
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.courses.lists(), filters] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.courses.details(), id] as const,
  },

  // Course Terms
  courseTerms: {
    all: ['courseTerms'] as const,
    lists: () => [...queryKeys.courseTerms.all, 'list'] as const,
    list: (courseId?: number) => [...queryKeys.courseTerms.lists(), courseId] as const,
    details: () => [...queryKeys.courseTerms.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.courseTerms.details(), id] as const,
  },

  // Enrollments
  enrollments: {
    all: ['enrollments'] as const,
    lists: () => [...queryKeys.enrollments.all, 'list'] as const,
    byStudent: (studentId: number) => [...queryKeys.enrollments.lists(), 'student', studentId] as const,
    byTerm: (termId: number) => [...queryKeys.enrollments.lists(), 'term', termId] as const,
    detail: (id: number) => [...queryKeys.enrollments.all, 'detail', id] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    superAdmin: () => [...queryKeys.dashboard.all, 'superAdmin'] as const,
    tenantAdmin: () => [...queryKeys.dashboard.all, 'tenantAdmin'] as const,
    user: () => [...queryKeys.dashboard.all, 'user'] as const,
  },

  // Tenants
  tenants: {
    all: ['tenants'] as const,
    lists: () => [...queryKeys.tenants.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.tenants.all, 'detail', id] as const,
  },

  // Tenant Applications
  tenantApplications: {
    all: ['tenantApplications'] as const,
    lists: () => [...queryKeys.tenantApplications.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.tenantApplications.all, 'detail', id] as const,
  },

  // Course Applications
  courseApplications: {
    all: ['courseApplications'] as const,
    lists: () => [...queryKeys.courseApplications.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.courseApplications.all, 'detail', id] as const,
  },

  // Notices
  notices: {
    all: ['notices'] as const,
    lists: () => [...queryKeys.notices.all, 'list'] as const,
    system: () => [...queryKeys.notices.lists(), 'system'] as const,
    tenant: () => [...queryKeys.notices.lists(), 'tenant'] as const,
    activeSystem: () => [...queryKeys.notices.all, 'active', 'system'] as const,
    activeTenant: () => [...queryKeys.notices.all, 'active', 'tenant'] as const,
    detail: (id: number) => [...queryKeys.notices.all, 'detail', id] as const,
  },
} as const;
