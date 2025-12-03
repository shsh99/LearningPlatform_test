import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useActiveSystemNotices, useActiveTenantNotices } from '../../hooks/useNotice';
import { filterVisibleNotices } from '../../types/notice';
import { NoticeModal } from './NoticeModal';
import type { ReactNode } from 'react';
import type { Notice } from '../../types/notice';

interface NoticeProviderProps {
  children: ReactNode;
}

export function NoticeProvider({ children }: NoticeProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const shownNoticeIdsRef = useRef<Set<number>>(new Set()); // 이미 표시한 공지 ID들

  // TENANT_ADMIN은 시스템 공지를 봄
  const isTenantAdmin = user?.role === 'TENANT_ADMIN';
  const isRegularUser = isAuthenticated && !['SUPER_ADMIN', 'TENANT_ADMIN'].includes(user?.role || '');

  // 시스템 공지 조회 (TENANT_ADMIN용)
  const {
    data: systemNotices,
    isSuccess: systemNoticesLoaded,
  } = useActiveSystemNotices(isTenantAdmin);

  // 테넌트 공지 조회 (일반 사용자용)
  const {
    data: tenantNotices,
    isSuccess: tenantNoticesLoaded,
  } = useActiveTenantNotices(isRegularUser);

  // 로그아웃 시 상태 초기화
  useEffect(() => {
    if (!isAuthenticated) {
      shownNoticeIdsRef.current = new Set();
      setNotices([]);
      setShowModal(false);
    }
  }, [isAuthenticated]);

  // TENANT_ADMIN용 시스템 공지 표시
  useEffect(() => {
    if (!isTenantAdmin || !systemNoticesLoaded || !systemNotices || systemNotices.length === 0) {
      return;
    }

    // 숨김 처리되지 않은 공지 필터링
    const visibleNotices = filterVisibleNotices(systemNotices);

    // 아직 표시하지 않은 공지만 필터링
    const newNotices = visibleNotices.filter(
      notice => !shownNoticeIdsRef.current.has(notice.id)
    );

    if (newNotices.length > 0) {
      // 새 공지 ID들을 표시한 것으로 기록
      newNotices.forEach(notice => shownNoticeIdsRef.current.add(notice.id));
      setNotices(newNotices);
      setShowModal(true);
    }
  }, [isTenantAdmin, systemNoticesLoaded, systemNotices]);

  // 일반 사용자용 테넌트 공지 표시
  useEffect(() => {
    if (!isRegularUser || !tenantNoticesLoaded || !tenantNotices || tenantNotices.length === 0) {
      return;
    }

    // 숨김 처리되지 않은 공지 필터링
    const visibleNotices = filterVisibleNotices(tenantNotices);

    // 아직 표시하지 않은 공지만 필터링
    const newNotices = visibleNotices.filter(
      notice => !shownNoticeIdsRef.current.has(notice.id)
    );

    if (newNotices.length > 0) {
      // 새 공지 ID들을 표시한 것으로 기록
      newNotices.forEach(notice => shownNoticeIdsRef.current.add(notice.id));
      setNotices(newNotices);
      setShowModal(true);
    }
  }, [isRegularUser, tenantNoticesLoaded, tenantNotices]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      {children}
      {showModal && notices.length > 0 && (
        <NoticeModal notices={notices} onClose={handleCloseModal} />
      )}
    </>
  );
}
