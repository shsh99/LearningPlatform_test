import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { parseFooterConfig, DEFAULT_FOOTER_CONFIG } from '../types/layout';
import type { FooterConfig } from '../types/layout';

/**
 * 푸터 설정을 관리하는 Hook
 * 현재 테넌트의 푸터 설정을 반환
 *
 * isEnabled 로직:
 * - branding.footerConfig가 없거나 null이면 false (기본 푸터 사용)
 * - branding.footerConfig가 있고 enabled가 true이면 true (커스텀 푸터 사용)
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

  // 커스텀 푸터 활성화 여부
  // branding.footerConfig가 설정되어 있고, enabled가 true일 때만 커스텀 푸터 사용
  const isCustomFooterEnabled = useMemo(() => {
    return !!(branding?.footerConfig && footerConfig.enabled);
  }, [branding?.footerConfig, footerConfig.enabled]);

  return {
    footerConfig,
    visibleLinks,
    visibleSocialLinks,
    isEnabled: isCustomFooterEnabled,
  };
}
