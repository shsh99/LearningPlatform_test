import type { ReactNode } from 'react';
import { Navbar } from '../Navbar';
import { LayoutBanner } from './LayoutBanner';
import { useLayout } from '../../hooks/useLayout';

interface PageLayoutProps {
  children: ReactNode;
  showBanner?: boolean;
}

/**
 * 페이지 레이아웃 래퍼 컴포넌트
 * Navbar와 레이아웃 설정에 따른 배너를 포함
 */
export function PageLayout({ children, showBanner = true }: PageLayoutProps) {
  const { bannerConfig } = useLayout();

  // 배너 위치에 따른 렌더링
  const showTopBanner = showBanner && bannerConfig?.enabled && bannerConfig.position === 'top';
  const showBottomBanner = showBanner && bannerConfig?.enabled && bannerConfig.position === 'bottom';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* 상단 배너 */}
      {showTopBanner && <LayoutBanner />}

      {/* 페이지 콘텐츠 */}
      <main>{children}</main>

      {/* 하단 배너 */}
      {showBottomBanner && <LayoutBanner />}
    </div>
  );
}
