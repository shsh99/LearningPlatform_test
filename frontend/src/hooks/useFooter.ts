import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { parseFooterConfig, DEFAULT_FOOTER_CONFIG } from '../types/layout';
import type { FooterConfig } from '../types/layout';

/**
 * 푸터 설정을 관리하는 Hook
 * 현재 테넌트의 푸터 설정을 반환
 */
export function useFooter() {
  const { branding } = useTenant();

  // 푸터 설정 파싱
  const footerConfig = useMemo<FooterConfig>(() => {
    if (!branding?.footerConfig) return DEFAULT_FOOTER_CONFIG;
    return parseFooterConfig(branding.footerConfig);
  }, [branding?.footerConfig]);

  // 활성화된 링크만 순서대로 정렬
  const visibleLinks = useMemo(() => {
    return footerConfig.links
      .filter((link) => link.enabled)
      .sort((a, b) => a.order - b.order);
  }, [footerConfig.links]);

  // 활성화된 소셜 링크만 필터링
  const visibleSocialLinks = useMemo(() => {
    return footerConfig.socialLinks.filter((link) => link.enabled);
  }, [footerConfig.socialLinks]);

  return {
    footerConfig,
    visibleLinks,
    visibleSocialLinks,
    isEnabled: footerConfig.enabled,
  };
}
