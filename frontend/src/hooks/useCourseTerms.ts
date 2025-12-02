import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import * as courseTermApi from '../api/courseTerm';
import type { CreateCourseTermRequest, UpdateCourseTermRequest } from '../types/courseTerm';

/**
 * 전체 차수 목록 조회 Hook
 */
export function useCourseTerms() {
  return useQuery({
    queryKey: queryKeys.courseTerms.lists(),
    queryFn: courseTermApi.getAllCourseTerms,
  });
}

/**
 * 강의별 차수 목록 조회 Hook
 */
export function useCourseTermsByCourse(courseId: number) {
  return useQuery({
    queryKey: queryKeys.courseTerms.list(courseId),
    queryFn: () => courseTermApi.getCourseTermsByCourseId(courseId),
    enabled: !!courseId,
  });
}

/**
 * 차수 단건 조회 Hook
 */
export function useCourseTerm(id: number) {
  return useQuery({
    queryKey: queryKeys.courseTerms.detail(id),
    queryFn: () => courseTermApi.getCourseTermById(id),
    enabled: !!id,
  });
}

/**
 * 차수 상세 조회 Hook (수강생, 강사 포함)
 */
export function useCourseTermDetail(id: number) {
  return useQuery({
    queryKey: [...queryKeys.courseTerms.detail(id), 'detail'] as const,
    queryFn: () => courseTermApi.getCourseTermDetail(id),
    enabled: !!id,
  });
}

/**
 * 차수 생성 Mutation Hook
 */
export function useCreateCourseTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseTermRequest) => courseTermApi.createCourseTerm(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.list(variables.courseId) });
    },
  });
}

/**
 * 차수 수정 Mutation Hook
 */
export function useUpdateCourseTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseTermRequest }) =>
      courseTermApi.updateCourseTerm(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.lists() });
    },
  });
}

/**
 * 차수 복제 Mutation Hook
 */
export function useDuplicateCourseTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, startDate, endDate }: { id: number; startDate: string; endDate: string }) =>
      courseTermApi.duplicateCourseTerm(id, startDate, endDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.all });
    },
  });
}

/**
 * 차수 시작 Mutation Hook
 */
export function useStartCourseTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseTermApi.startCourseTerm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.lists() });
    },
  });
}

/**
 * 차수 완료 Mutation Hook
 */
export function useCompleteCourseTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseTermApi.completeCourseTerm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.lists() });
      // 수강생 상태도 변경됨
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },
  });
}

/**
 * 차수 취소 Mutation Hook
 */
export function useCancelCourseTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseTermApi.cancelCourseTerm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.lists() });
    },
  });
}
