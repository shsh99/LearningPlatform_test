/**
 * 테넌트 URL 유틸리티
 *
 * URL 구조:
 * - 기본: /login, /apply-tenant, /super-admin/*
 * - 테넌트별: /{tenantCode}/login, /{tenantCode}/courses
 */

/**
 * 테넌트 경로 생성
 * @param tenantCode - 테넌트 코드 (회사 코드)
 * @param path - 경로 (예: '/login', '/courses')
 * @returns 테넌트 경로 (예: '/kakao/login')
 */
export function buildTenantPath(tenantCode: string | null | undefined, path: string): string {
    // path가 이미 /로 시작하지 않으면 추가
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // tenantCode가 없으면 기본 경로 반환
    if (!tenantCode) {
        return normalizedPath;
    }

    return `/${tenantCode}${normalizedPath}`;
}

/**
 * 현재 URL에서 테넌트 코드 추출
 * @param pathname - URL pathname
 * @returns 테넌트 코드 또는 null
 */
export function extractTenantCode(pathname: string): string | null {
    // 기본 경로들은 테넌트 코드가 아님
    const rootPaths = [
        'login',
        'signup',
        'apply-tenant',
        'super-admin',
        'api',
    ];

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return null;
    }

    const firstSegment = segments[0];

    // 기본 경로면 테넌트 코드가 아님
    if (rootPaths.includes(firstSegment)) {
        return null;
    }

    // 첫 번째 세그먼트가 테넌트 코드로 간주
    return firstSegment;
}

/**
 * 테넌트 경로인지 확인
 * @param pathname - URL pathname
 * @returns 테넌트 경로 여부
 */
export function isTenantPath(pathname: string): boolean {
    return extractTenantCode(pathname) !== null;
}

/**
 * 테넌트 코드 유효성 검사 (영소문자, 숫자, 하이픈만)
 * @param code - 테넌트 코드
 * @returns 유효 여부
 */
export function isValidTenantCode(code: string): boolean {
    return /^[a-z0-9-]+$/.test(code);
}

/**
 * 경로에서 테넌트 코드를 제거한 내부 경로 추출
 * @param pathname - URL pathname
 * @param tenantCode - 테넌트 코드
 * @returns 내부 경로 (예: /kakao/courses -> /courses)
 */
export function getInternalPath(pathname: string, tenantCode: string | null): string {
    if (!tenantCode) {
        return pathname;
    }

    const prefix = `/${tenantCode}`;
    if (pathname.startsWith(prefix)) {
        const internal = pathname.slice(prefix.length);
        return internal || '/';
    }

    return pathname;
}
