import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import type { TenantBannerConfig, BannerAreaConfig } from '../types/layout';
import { DEFAULT_TENANT_BANNER, DEFAULT_BANNER_AREA } from '../types/layout';

/**
 * 테넌트 공통 배너 설정을 파싱하는 함수
 */
function parseBannerConfig(json: string | null | undefined): TenantBannerConfig {
  if (!json) return DEFAULT_TENANT_BANNER;

  try {
    const parsed = JSON.parse(json);
    return {
      top: parsed.top ? { ...DEFAULT_BANNER_AREA, ...parsed.top } : DEFAULT_BANNER_AREA,
      bottom: parsed.bottom ? { ...DEFAULT_BANNER_AREA, ...parsed.bottom } : DEFAULT_BANNER_AREA,
    };
  } catch (error) {
    console.error('Failed to parse banner config:', error);
    return DEFAULT_TENANT_BANNER;
  }
}

/**
 * 테넌트 공통 배너 설정을 관리하는 Hook
 * 역할과 무관하게 모든 사용자에게 동일한 배너가 표시됨
 */
export function useBanner() {
  const { branding } = useTenant();

  // 배너 설정 파싱
  const bannerConfig = useMemo<TenantBannerConfig>(() => {
    return parseBannerConfig(branding?.bannerConfig);
  }, [branding?.bannerConfig]);

  // 상단 배너 설정
  const topBanner = useMemo<BannerAreaConfig | undefined>(() => {
    return bannerConfig.top;
  }, [bannerConfig]);

  // 하단 배너 설정
  const bottomBanner = useMemo<BannerAreaConfig | undefined>(() => {
    return bannerConfig.bottom;
  }, [bannerConfig]);

  // 상단 배너가 활성화되어 있는지
  const hasTopBanner = useMemo(() => {
    const hasSlides = topBanner?.slides && topBanner.slides.length > 0;
    const hasEnabledSlides = hasSlides && topBanner.slides.some((s) => s.enabled);
    return topBanner?.enabled && hasEnabledSlides;
  }, [topBanner]);

  // 하단 배너가 활성화되어 있는지
  const hasBottomBanner = useMemo(() => {
    const hasSlides = bottomBanner?.slides && bottomBanner.slides.length > 0;
    const hasEnabledSlides = hasSlides && bottomBanner.slides.some((s) => s.enabled);
    return bottomBanner?.enabled && hasEnabledSlides;
  }, [bottomBanner]);

  return {
    bannerConfig,
    topBanner,
    bottomBanner,
    hasTopBanner,
    hasBottomBanner,
  };
}

/**
 * 배너 설정을 JSON 문자열로 변환
 */
export function bannerConfigToJson(config: TenantBannerConfig): string {
  return JSON.stringify(config, null, 2);
}
