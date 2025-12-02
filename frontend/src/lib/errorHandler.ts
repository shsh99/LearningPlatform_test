import { AxiosError } from 'axios';
import { ApiError, ErrorCode } from '../types/error';
import type { ApiErrorResponse } from '../types/error';

/**
 * Axios 에러를 ApiError로 변환
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;

    // Backend ErrorResponse 형식인지 확인
    if (data.code && data.message && data.status) {
      return new ApiError(data);
    }

    // 일반적인 HTTP 에러 응답
    return new ApiError({
      code: ErrorCode.INTERNAL_ERROR,
      message: data.message || error.message || '알 수 없는 오류가 발생했습니다.',
      status: error.response.status,
      timestamp: new Date().toISOString(),
      path: error.config?.url || '',
    });
  }

  if (error instanceof AxiosError) {
    // 네트워크 에러 등
    return new ApiError({
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message || '네트워크 연결을 확인해주세요.',
      status: 0,
      timestamp: new Date().toISOString(),
      path: error.config?.url || '',
    });
  }

  // 기타 에러
  return new ApiError({
    code: ErrorCode.INTERNAL_ERROR,
    message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    status: 500,
    timestamp: new Date().toISOString(),
    path: '',
  });
}

/**
 * 에러 코드별 사용자 친화적 메시지 매핑
 */
const errorMessages: Record<string, string> = {
  // Common
  [ErrorCode.INVALID_INPUT]: '입력값이 올바르지 않습니다.',
  [ErrorCode.RESOURCE_NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ErrorCode.INTERNAL_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
  [ErrorCode.VALIDATION_ERROR]: '입력값을 확인해주세요.',
  [ErrorCode.DUPLICATE_RESOURCE]: '이미 존재하는 데이터입니다.',

  // Auth
  [ErrorCode.INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
  [ErrorCode.TOKEN_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCode.INVALID_TOKEN]: '유효하지 않은 인증 정보입니다.',
  [ErrorCode.TOKEN_NOT_FOUND]: '인증 정보가 없습니다. 로그인해주세요.',
  [ErrorCode.REFRESH_TOKEN_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',

  // User
  [ErrorCode.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
  [ErrorCode.DUPLICATE_EMAIL]: '이미 사용 중인 이메일입니다.',
  [ErrorCode.INVALID_PASSWORD]: '비밀번호가 올바르지 않습니다.',
  [ErrorCode.USER_DISABLED]: '비활성화된 계정입니다. 관리자에게 문의하세요.',
  [ErrorCode.EMAIL_NOT_VERIFIED]: '이메일 인증이 필요합니다.',

  // Course
  [ErrorCode.COURSE_NOT_FOUND]: '강의를 찾을 수 없습니다.',
  [ErrorCode.DUPLICATE_COURSE]: '이미 존재하는 강의입니다.',
  [ErrorCode.INVALID_COURSE_STATUS]: '강의 상태가 올바르지 않습니다.',
  [ErrorCode.COURSE_ALREADY_APPROVED]: '이미 승인된 강의입니다.',
  [ErrorCode.COURSE_ALREADY_REJECTED]: '이미 거부된 강의입니다.',

  // Term
  [ErrorCode.TERM_NOT_FOUND]: '차수를 찾을 수 없습니다.',
  [ErrorCode.TERM_CAPACITY_EXCEEDED]: '수강 정원이 초과되었습니다.',
  [ErrorCode.INVALID_TERM_DATE]: '차수 날짜가 올바르지 않습니다.',
  [ErrorCode.TERM_ALREADY_STARTED]: '이미 시작된 차수입니다.',
  [ErrorCode.TERM_ALREADY_COMPLETED]: '이미 완료된 차수입니다.',
  [ErrorCode.INVALID_TERM_STATUS_TRANSITION]: '차수 상태 변경이 불가능합니다.',
  [ErrorCode.CANNOT_CANCEL_STARTED_COURSE]: '이미 시작된 강의는 취소할 수 없습니다.',

  // Enrollment
  [ErrorCode.ENROLLMENT_NOT_FOUND]: '수강 신청 정보를 찾을 수 없습니다.',
  [ErrorCode.ALREADY_ENROLLED]: '이미 수강 신청된 강의입니다.',
  [ErrorCode.ENROLLMENT_PERIOD_CLOSED]: '수강 신청 기간이 종료되었습니다.',
  [ErrorCode.CANNOT_CANCEL_COMPLETED]: '완료된 수강은 취소할 수 없습니다.',
  [ErrorCode.DUPLICATE_ENROLLMENT]: '이미 수강 신청한 차수입니다.',

  // Tenant
  [ErrorCode.TENANT_NOT_FOUND]: '테넌트를 찾을 수 없습니다.',
  [ErrorCode.DUPLICATE_TENANT]: '이미 존재하는 테넌트입니다.',
  [ErrorCode.TENANT_DISABLED]: '비활성화된 테넌트입니다.',
  [ErrorCode.INVALID_TENANT_STATUS]: '테넌트 상태가 올바르지 않습니다.',
};

/**
 * 에러 메시지 가져오기 (사용자 친화적)
 */
export function getErrorMessage(error: unknown): string {
  const apiError = parseApiError(error);

  // 에러 코드에 매핑된 메시지가 있으면 사용
  if (errorMessages[apiError.code]) {
    return errorMessages[apiError.code];
  }

  // validation 에러의 경우 details 정보 활용
  if (apiError.isValidationError() && apiError.details) {
    const detailMessages = Object.values(apiError.details);
    if (detailMessages.length > 0) {
      return detailMessages.join(', ');
    }
  }

  // 기본 메시지 반환
  return apiError.message;
}

/**
 * 에러 로깅 (개발 환경에서만)
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    const apiError = parseApiError(error);
    console.error(`[${context || 'Error'}]`, {
      code: apiError.code,
      message: apiError.message,
      status: apiError.status,
      path: apiError.path,
      details: apiError.details,
    });
  }
}

/**
 * API 에러 핸들러 (React Query onError 콜백용)
 */
export function handleApiError(error: unknown, context?: string): void {
  logError(error, context);

  const apiError = parseApiError(error);

  // 인증 에러는 별도 처리 (client.ts에서 처리하므로 여기서는 로깅만)
  if (apiError.isAuthError()) {
    return;
  }

  // 권한 에러
  if (apiError.isForbiddenError()) {
    // 토스트나 알림으로 처리할 수 있음
    console.warn('접근 권한이 없습니다.');
  }
}
