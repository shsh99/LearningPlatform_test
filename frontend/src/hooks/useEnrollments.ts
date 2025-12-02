import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import * as enrollmentApi from '../api/enrollment';
import type { CreateEnrollmentRequest, DirectEnrollmentRequest } from '../types/enrollment';

/**
 * 수강신청 단건 조회 Hook
 */
export function useEnrollment(id: number) {
  return useQuery({
    queryKey: queryKeys.enrollments.detail(id),
    queryFn: () => enrollmentApi.getEnrollmentById(id),
    enabled: !!id,
  });
}

/**
 * 학생별 수강신청 목록 조회 Hook
 */
export function useEnrollmentsByStudent(studentId: number) {
  return useQuery({
    queryKey: queryKeys.enrollments.byStudent(studentId),
    queryFn: () => enrollmentApi.getEnrollmentsByStudent(studentId),
    enabled: !!studentId,
  });
}

/**
 * 차수별 수강신청 목록 조회 Hook
 */
export function useEnrollmentsByTerm(termId: number) {
  return useQuery({
    queryKey: queryKeys.enrollments.byTerm(termId),
    queryFn: () => enrollmentApi.getEnrollmentsByTerm(termId),
    enabled: !!termId,
  });
}

/**
 * 수강신청 생성 Mutation Hook
 */
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEnrollmentRequest) => enrollmentApi.enrollCourse(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.byStudent(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.byTerm(variables.termId) });
      // 차수 정보도 갱신 (수강생 수 변경)
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.all });
    },
  });
}

/**
 * 관리자 직접 수강등록 Mutation Hook
 */
export function useDirectEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DirectEnrollmentRequest) => enrollmentApi.directEnrollment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.byStudent(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.byTerm(variables.termId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.all });
    },
  });
}

/**
 * 수강신청 취소 Mutation Hook
 */
export function useCancelEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => enrollmentApi.cancelEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.courseTerms.all });
    },
  });
}

/**
 * 수강 완료 처리 Mutation Hook
 */
export function useCompleteEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => enrollmentApi.completeEnrollment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },
  });
}
