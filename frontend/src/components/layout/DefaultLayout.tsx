import { DefaultFooter } from './DefaultFooter';
import type { ReactNode } from 'react';

interface DefaultLayoutProps {
  children: ReactNode;
}

/**
 * 기본 레이아웃
 * 테넌트가 아닌 페이지(로그인, 회원가입, SUPER_ADMIN 등)에 사용
 * 항상 DefaultFooter를 표시
 */
export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{children}</div>
      <DefaultFooter />
    </div>
  );
}
