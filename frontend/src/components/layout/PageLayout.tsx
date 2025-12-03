import type { ReactNode } from 'react';
import { Navbar } from '../Navbar';

interface PageLayoutProps {
  children: ReactNode;
}

/**
 * 페이지 레이아웃 래퍼 컴포넌트
 * Navbar를 포함
 */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* 페이지 콘텐츠 */}
      <main>{children}</main>
    </div>
  );
}
