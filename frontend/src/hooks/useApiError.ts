import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage, parseApiError, logError } from '../lib/errorHandler';
import { ApiError, ErrorCode } from '../types/error';

interface UseApiErrorOptions {
  showToast?: boolean;
  logErrors?: boolean;
}

/**
 * API 에러 처리를 위한 커스텀 훅
 */
export function useApiError(options: UseApiErrorOptions = {}) {
  const { showToast = true, logErrors = true } = options;
  const toast = useToast();

  /**
   * 에러 처리 함수
   */
  const handleError = useCallback(
    (error: unknown, context?: string) => {
      if (logErrors) {
        logError(error, context);
      }

      const apiError = parseApiError(error);

      // 인증 에러는 client.ts에서 처리하므로 스킵
      if (apiError.isAuthError()) {
        return apiError;
      }

      // 토스트 표시
      if (showToast) {
        const message = getErrorMessage(error);
        toast.error(message);
      }

      return apiError;
    },
    [showToast, logErrors, toast]
  );

  /**
   * React Query의 onError 콜백으로 사용
   */
  const onQueryError = useCallback(
    (error: unknown) => {
      handleError(error, 'Query');
    },
    [handleError]
  );

  /**
   * React Query의 mutation onError 콜백으로 사용
   */
  const onMutationError = useCallback(
    (error: unknown) => {
      handleError(error, 'Mutation');
    },
    [handleError]
  );

  /**
   * 특정 에러 코드 체크
   */
  const isErrorCode = useCallback((error: unknown, code: string): boolean => {
    const apiError = parseApiError(error);
    return apiError.code === code;
  }, []);

  return {
    handleError,
    onQueryError,
    onMutationError,
    isErrorCode,
    parseApiError,
    getErrorMessage,
  };
}

/**
 * Mutation 성공/실패 토스트를 자동으로 처리하는 옵션 생성
 */
export function useMutationToast() {
  const toast = useToast();

  return {
    /**
     * mutation 옵션에 추가할 성공/실패 콜백 생성
     */
    withToast: <TData, TError, TVariables>(options: {
      successMessage?: string | ((data: TData, variables: TVariables) => string);
      errorMessage?: string | ((error: TError) => string);
    }) => ({
      onSuccess: (data: TData, variables: TVariables) => {
        if (options.successMessage) {
          const message =
            typeof options.successMessage === 'function'
              ? options.successMessage(data, variables)
              : options.successMessage;
          toast.success(message);
        }
      },
      onError: (error: TError) => {
        const message =
          typeof options.errorMessage === 'function'
            ? options.errorMessage(error)
            : options.errorMessage || getErrorMessage(error);
        toast.error(message);
      },
    }),
  };
}

// 에러 타입과 코드를 re-export
export { ApiError, ErrorCode };
