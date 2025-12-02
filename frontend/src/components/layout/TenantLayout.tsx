import type { ReactNode } from 'react';
import { LayoutBanner } from './LayoutBanner';
import { useBanner } from '../../hooks/useBanner';

interface TenantLayoutProps {
  children: ReactNode;
}

/**
 * 테넌트 공통 레이아웃 래퍼
 * 페이지 콘텐츠를 감싸고 하단 배너를 표시하는 역할
 * (상단 배너는 Navbar에서 처리)
 */
export function TenantLayout({ children }: TenantLayoutProps) {
  const { hasBottomBanner } = useBanner();

  return (
    <>
      {/* 페이지 콘텐츠 */}
      {children}

      {/* 하단 배너 */}
      {hasBottomBanner && <LayoutBanner position="bottom" />}
    </>
  );
}
