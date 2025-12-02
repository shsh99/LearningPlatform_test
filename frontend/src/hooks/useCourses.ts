import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import * as courseApi from '../api/course';
import type { CreateCourseRequest, UpdateCourseRequest, CourseStatus } from '../types/course';

/**
 * 전체 강의 목록 조회 Hook
 */
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.lists(),
    queryFn: courseApi.getAllCourses,
  });
}

/**
 * 강의 단건 조회 Hook
 */
export function useCourse(id: number) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => courseApi.getCourseById(id),
    enabled: !!id,
  });
}

/**
 * 상태별 강의 목록 조회 Hook
 */
export function useCoursesByStatus(status: CourseStatus) {
  return useQuery({
    queryKey: queryKeys.courses.list({ status }),
    queryFn: () => courseApi.getCoursesByStatus(status),
    enabled: !!status,
  });
}

/**
 * 강의 검색 Hook
 */
export function useSearchCourses(keyword: string) {
  return useQuery({
    queryKey: queryKeys.courses.list({ keyword }),
    queryFn: () => courseApi.searchCourses(keyword),
    enabled: keyword.length > 0,
  });
}

/**
 * 강의 생성 Mutation Hook
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => courseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });
}

/**
 * 강의 수정 Mutation Hook
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseRequest }) =>
      courseApi.updateCourse(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
    },
  });
}

/**
 * 강의 삭제 Mutation Hook
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });
}

/**
 * 강의 승인 Mutation Hook
 */
export function useApproveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseApi.approveCourse(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
    },
  });
}

/**
 * 강의 거부 Mutation Hook
 */
export function useRejectCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseApi.rejectCourse(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
    },
  });
}
