import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getCurrentTenantBranding,
    getCurrentTenantSettings,
    getCurrentTenantLabels,
    getPublicTenantBranding,
    getPublicTenantLabels,
    checkTenantExists
} from '../api/tenant';
import { getFullFileUrl } from '../api/file';
import type { TenantBranding, TenantSettings, TenantLabels } from '../types/tenant';
import { DEFAULT_BRANDING, DEFAULT_LABELS } from '../types/tenant';
import { extractTenantCode, buildTenantPath, isValidTenantCode } from '../utils/tenantUrl';

interface TenantContextValue {
    tenantCode: string | null;
    branding: TenantBranding;
    settings: TenantSettings | null;
    labels: TenantLabels;
    isLoading: boolean;
    error: string | null;
    isTenantRoute: boolean;
    refreshTenant: () => Promise<void>;
    buildPath: (path: string) => string;
    navigate: (path: string) => void;
}

const TenantContext = createContext<TenantContextValue | null>(null);

/**
 * CSS 변수를 document root에 적용
 */
const applyCssVariables = (branding: TenantBranding) => {
    const root = document.documentElement;

    // 기본 색상
    root.style.setProperty('--color-primary', branding.primaryColor);
    root.style.setProperty('--color-secondary', branding.secondaryColor);
    root.style.setProperty('--color-accent', branding.accentColor);

    // 헤더
    root.style.setProperty('--header-bg', branding.headerBgColor);
    root.style.setProperty('--header-text', branding.headerTextColor);

    // 사이드바
    root.style.setProperty('--sidebar-bg', branding.sidebarBgColor);
    root.style.setProperty('--sidebar-text', branding.sidebarTextColor);
    root.style.setProperty('--sidebar-active', branding.sidebarActiveColor);
    root.style.setProperty('--sidebar-active-text', branding.sidebarActiveTextColor);

    // 버튼
    root.style.setProperty('--button-primary-bg', branding.buttonPrimaryBgColor);
    root.style.setProperty('--button-primary-text', branding.buttonPrimaryTextColor);
    root.style.setProperty('--button-secondary-bg', branding.buttonSecondaryBgColor);
    root.style.setProperty('--button-secondary-text', branding.buttonSecondaryTextColor);

    // 커스텀 폰트 @font-face 등록
    let fontStyleElement = document.getElementById('tenant-custom-font');
    if (branding.fontUrl) {
        const fullFontUrl = getFullFileUrl(branding.fontUrl);
        if (fullFontUrl) {
            if (!fontStyleElement) {
                fontStyleElement = document.createElement('style');
                fontStyleElement.id = 'tenant-custom-font';
                document.head.appendChild(fontStyleElement);
            }
            fontStyleElement.textContent = `
                @font-face {
                    font-family: 'TenantCustomFont';
                    src: url('${fullFontUrl}') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }
            `;
            // 커스텀 폰트가 있으면 fontFamily를 TenantCustomFont로 설정
            root.style.setProperty('--font-family', "'TenantCustomFont', " + branding.fontFamily);
        }
    } else {
        if (fontStyleElement) {
            fontStyleElement.remove();
        }
        root.style.setProperty('--font-family', branding.fontFamily);
    }

    // 커스텀 CSS 적용
    let customStyleElement = document.getElementById('tenant-custom-css');
    if (branding.customCss) {
        if (!customStyleElement) {
            customStyleElement = document.createElement('style');
            customStyleElement.id = 'tenant-custom-css';
            document.head.appendChild(customStyleElement);
        }
        customStyleElement.textContent = branding.customCss;
    } else if (customStyleElement) {
        customStyleElement.remove();
    }

    // 파비콘 적용
    if (branding.faviconUrl) {
        const fullFaviconUrl = getFullFileUrl(branding.faviconUrl);
        let faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            document.head.appendChild(faviconLink);
        }
        faviconLink.href = fullFaviconUrl || branding.faviconUrl;
    }
};

interface TenantProviderProps {
    children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
    const location = useLocation();
    const reactNavigate = useNavigate();

    const [tenantCode, setTenantCode] = useState<string | null>(null);
    const [branding, setBranding] = useState<TenantBranding>(DEFAULT_BRANDING);
    const [settings, setSettings] = useState<TenantSettings | null>(null);
    const [labels, setLabels] = useState<TenantLabels>(DEFAULT_LABELS);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTenantRoute, setIsTenantRoute] = useState(false);

    // URL에서 테넌트 코드 추출
    useEffect(() => {
        const code = extractTenantCode(location.pathname);
        setTenantCode(code);
        setIsTenantRoute(!!code);
    }, [location.pathname]);

    // 테넌트 데이터 로드
    const fetchTenantData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');

            // URL에 테넌트 코드가 있는 경우 (테넌트별 페이지)
            if (tenantCode && isValidTenantCode(tenantCode)) {
                // 먼저 테넌트가 존재하는지 확인
                const exists = await checkTenantExists(tenantCode).catch(() => false);

                if (!exists) {
                    setError('존재하지 않는 테넌트입니다.');
                    applyCssVariables(DEFAULT_BRANDING);
                    setIsLoading(false);
                    return;
                }

                // 공개 API로 브랜딩/라벨 로드
                const [brandingData, labelsData] = await Promise.all([
                    getPublicTenantBranding(tenantCode).catch(() => null),
                    getPublicTenantLabels(tenantCode).catch(() => null),
                ]);

                if (brandingData) {
                    setBranding(brandingData);
                    applyCssVariables(brandingData);
                }

                if (labelsData) {
                    setLabels(labelsData);
                }

                // 로그인된 상태면 설정도 로드
                if (token) {
                    const settingsData = await getCurrentTenantSettings().catch(() => null);
                    if (settingsData) {
                        setSettings(settingsData);
                    }
                }
            }
            // 로그인 상태이고 테넌트 코드가 없는 경우 (기본 페이지)
            else if (token) {
                const [brandingData, settingsData, labelsData] = await Promise.all([
                    getCurrentTenantBranding().catch(() => null),
                    getCurrentTenantSettings().catch(() => null),
                    getCurrentTenantLabels().catch(() => null),
                ]);

                if (brandingData) {
                    setBranding(brandingData);
                    applyCssVariables(brandingData);
                }

                if (settingsData) {
                    setSettings(settingsData);
                }

                if (labelsData) {
                    setLabels(labelsData);
                }
            }
            // 비로그인 + 테넌트 코드 없음 (기본 랜딩 페이지)
            else {
                applyCssVariables(DEFAULT_BRANDING);
            }
        } catch (err) {
            console.error('Failed to fetch tenant data:', err);
            setError('테넌트 정보를 불러오는데 실패했습니다.');
            applyCssVariables(DEFAULT_BRANDING);
        } finally {
            setIsLoading(false);
        }
    }, [tenantCode]);

    useEffect(() => {
        fetchTenantData();
    }, [fetchTenantData]);

    const refreshTenant = useCallback(async () => {
        await fetchTenantData();
    }, [fetchTenantData]);

    // 테넌트 경로 빌더
    const buildPath = useCallback((path: string): string => {
        return buildTenantPath(tenantCode, path);
    }, [tenantCode]);

    // 테넌트 경로로 네비게이션
    const navigate = useCallback((path: string) => {
        const fullPath = buildTenantPath(tenantCode, path);
        reactNavigate(fullPath);
    }, [tenantCode, reactNavigate]);

    return (
        <TenantContext.Provider
            value={{
                tenantCode,
                branding,
                settings,
                labels,
                isLoading,
                error,
                isTenantRoute,
                refreshTenant,
                buildPath,
                navigate,
            }}
        >
            {children}
        </TenantContext.Provider>
    );
};

/**
 * 테넌트 정보를 사용하는 훅
 */
export const useTenant = (): TenantContextValue => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};

/**
 * 테넌트 브랜딩만 사용하는 훅
 */
export const useBranding = () => {
    const { branding } = useTenant();
    return branding;
};

/**
 * 테넌트 설정만 사용하는 훅
 */
export const useSettings = () => {
    const { settings } = useTenant();
    return settings;
};

/**
 * 테넌트 라벨만 사용하는 훅 (useLabel)
 */
export const useLabels = () => {
    const { labels } = useTenant();
    return labels;
};

/**
 * 특정 라벨을 가져오는 훅
 */
export const useLabel = (key: keyof Omit<TenantLabels, 'tenantId' | 'customLabels'>) => {
    const labels = useLabels();
    return labels[key];
};

/**
 * 기능이 활성화되어 있는지 확인하는 훅
 */
export const useFeatureEnabled = (feature: keyof TenantSettings) => {
    const settings = useSettings();
    if (!settings) return true; // 설정이 없으면 기본적으로 활성화
    return settings[feature] as boolean;
};

/**
 * 테넌트 네비게이션 훅
 */
export const useTenantNavigation = () => {
    const { buildPath, navigate, tenantCode } = useTenant();
    return { buildPath, navigate, tenantCode };
};

export default TenantContext;
