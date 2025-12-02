/**
 * Backend ErrorResponse와 매칭되는 API 에러 타입
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  status: number;
  timestamp: string;
  path: string;
  details?: Record<string, string>;
}

/**
 * 에러 코드 상수 (Backend ErrorCode와 동기화)
 */
export const ErrorCode = {
  // Common Errors (C)
  INVALID_INPUT: 'C001',
  RESOURCE_NOT_FOUND: 'C002',
  INTERNAL_ERROR: 'C003',
  UNAUTHORIZED: 'C004',
  FORBIDDEN: 'C005',
  VALIDATION_ERROR: 'C006',
  DUPLICATE_RESOURCE: 'C007',

  // Auth Errors (A)
  INVALID_CREDENTIALS: 'A001',
  TOKEN_EXPIRED: 'A002',
  INVALID_TOKEN: 'A003',
  TOKEN_NOT_FOUND: 'A004',
  REFRESH_TOKEN_EXPIRED: 'A005',

  // User Errors (U)
  USER_NOT_FOUND: 'U001',
  DUPLICATE_EMAIL: 'U002',
  INVALID_PASSWORD: 'U003',
  USER_DISABLED: 'U004',
  EMAIL_NOT_VERIFIED: 'U005',

  // Course Errors (CR)
  COURSE_NOT_FOUND: 'CR001',
  DUPLICATE_COURSE: 'CR002',
  INVALID_COURSE_STATUS: 'CR003',
  COURSE_ALREADY_APPROVED: 'CR004',
  COURSE_ALREADY_REJECTED: 'CR005',

  // Term Errors (T)
  TERM_NOT_FOUND: 'T001',
  TERM_CAPACITY_EXCEEDED: 'T002',
  INVALID_TERM_DATE: 'T003',
  TERM_ALREADY_STARTED: 'T004',
  TERM_ALREADY_COMPLETED: 'T005',
  INVALID_TERM_STATUS_TRANSITION: 'T006',
  CANNOT_CANCEL_STARTED_COURSE: 'T007',

  // Enrollment Errors (E)
  ENROLLMENT_NOT_FOUND: 'E001',
  ALREADY_ENROLLED: 'E002',
  ENROLLMENT_PERIOD_CLOSED: 'E003',
  CANNOT_CANCEL_COMPLETED: 'E004',
  DUPLICATE_ENROLLMENT: 'E005',

  // Tenant Errors (TN)
  TENANT_NOT_FOUND: 'TN001',
  DUPLICATE_TENANT: 'TN002',
  TENANT_DISABLED: 'TN003',
  INVALID_TENANT_STATUS: 'TN004',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * 커스텀 API 에러 클래스
 */
export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly timestamp: string;
  public readonly path: string;
  public readonly details?: Record<string, string>;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.code = response.code;
    this.status = response.status;
    this.timestamp = response.timestamp;
    this.path = response.path;
    this.details = response.details;
  }

  /**
   * 특정 에러 코드인지 확인
   */
  is(code: ErrorCodeType): boolean {
    return this.code === code;
  }

  /**
   * 인증 관련 에러인지 확인
   */
  isAuthError(): boolean {
    return this.code.startsWith('A') || this.status === 401;
  }

  /**
   * 권한 관련 에러인지 확인
   */
  isForbiddenError(): boolean {
    return this.code === ErrorCode.FORBIDDEN || this.status === 403;
  }

  /**
   * 리소스 미존재 에러인지 확인
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * 유효성 검증 에러인지 확인
   */
  isValidationError(): boolean {
    return this.code === ErrorCode.VALIDATION_ERROR || this.status === 400;
  }

  /**
   * 중복 리소스 에러인지 확인
   */
  isConflictError(): boolean {
    return this.status === 409;
  }
}
