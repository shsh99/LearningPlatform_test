import type { ReactNode } from 'react';
import { LayoutBanner } from './LayoutBanner';
import { TenantFooter } from './TenantFooter';
import { DefaultFooter } from './DefaultFooter';
import { useBanner } from '../../hooks/useBanner';
import { useFooter } from '../../hooks/useFooter';

interface TenantLayoutProps {
  children: ReactNode;
}

/**
 * 테넌트 공통 레이아웃 래퍼
 * 페이지 콘텐츠를 감싸고 하단 배너와 푸터를 표시하는 역할
 * (상단 배너는 Navbar에서 처리)
 */
export function TenantLayout({ children }: TenantLayoutProps) {
  const { hasBottomBanner } = useBanner();
  const { isEnabled: isFooterEnabled } = useFooter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 페이지 콘텐츠 */}
      <div className="flex-1">{children}</div>

      {/* 하단 배너 */}
      {hasBottomBanner && <LayoutBanner position="bottom" />}

      {/* 푸터 - 테넌트 푸터가 활성화되어 있으면 테넌트 푸터, 아니면 기본 푸터 */}
      {isFooterEnabled ? <TenantFooter /> : <DefaultFooter />}
    </div>
  );
}
