import { useBanner } from '../../hooks/useBanner';
import { BannerCarousel } from './BannerCarousel';

interface LayoutBannerProps {
  position: 'top' | 'bottom';
}

/**
 * 레이아웃 배너 컴포넌트
 * 테넌트 공통 배너 설정에 따라 상단 또는 하단 배너를 표시
 */
export function LayoutBanner({ position }: LayoutBannerProps) {
  const { topBanner, bottomBanner, hasTopBanner, hasBottomBanner } = useBanner();

  // 위치에 따른 배너 설정 선택
  if (position === 'top') {
    if (!hasTopBanner || !topBanner) return null;
    return <BannerCarousel config={topBanner} position="top" />;
  }

  if (position === 'bottom') {
    if (!hasBottomBanner || !bottomBanner) return null;
    return <BannerCarousel config={bottomBanner} position="bottom" />;
  }

  return null;
}
