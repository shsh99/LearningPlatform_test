/**
 * 공지 타입
 */
export type NoticeType = 'SYSTEM' | 'TENANT';

/**
 * 공지 응답 타입
 */
export interface Notice {
  id: number;
  type: NoticeType;
  tenantId: number | null;
  title: string;
  content: string;
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 공지 생성 요청
 */
export interface CreateNoticeRequest {
  type: NoticeType;
  tenantId?: number;
  title: string;
  content: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 공지 수정 요청
 */
export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  enabled?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * 공지 페이지 응답
 */
export interface NoticePage {
  content: Notice[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * localStorage에 저장되는 숨김 공지 정보
 */
export interface HiddenNoticeInfo {
  noticeId: number;
  hiddenUntil: number; // timestamp (밀리초)
}

/**
 * 공지 숨김 상태 키 (localStorage)
 */
export const HIDDEN_NOTICES_KEY = 'hidden_notices';

/**
 * 숨김 공지 저장
 */
export function hideNoticeForToday(noticeId: number): void {
  const hiddenNotices = getHiddenNotices();
  const hiddenUntil = Date.now() + 24 * 60 * 60 * 1000; // 24시간 후

  // 기존 항목 업데이트 또는 새로 추가
  const existingIndex = hiddenNotices.findIndex(n => n.noticeId === noticeId);
  if (existingIndex >= 0) {
    hiddenNotices[existingIndex].hiddenUntil = hiddenUntil;
  } else {
    hiddenNotices.push({ noticeId, hiddenUntil });
  }

  localStorage.setItem(HIDDEN_NOTICES_KEY, JSON.stringify(hiddenNotices));
}

/**
 * 숨김 공지 목록 가져오기
 */
export function getHiddenNotices(): HiddenNoticeInfo[] {
  try {
    const stored = localStorage.getItem(HIDDEN_NOTICES_KEY);
    if (!stored) return [];

    const hiddenNotices: HiddenNoticeInfo[] = JSON.parse(stored);
    const now = Date.now();

    // 만료된 항목 제거
    const validNotices = hiddenNotices.filter(n => n.hiddenUntil > now);

    // 만료된 항목이 있으면 localStorage 업데이트
    if (validNotices.length !== hiddenNotices.length) {
      localStorage.setItem(HIDDEN_NOTICES_KEY, JSON.stringify(validNotices));
    }

    return validNotices;
  } catch {
    return [];
  }
}

/**
 * 공지가 숨김 상태인지 확인
 */
export function isNoticeHidden(noticeId: number): boolean {
  const hiddenNotices = getHiddenNotices();
  return hiddenNotices.some(n => n.noticeId === noticeId);
}

/**
 * 표시할 공지 필터링 (숨김 처리된 공지 제외)
 */
export function filterVisibleNotices(notices: Notice[]): Notice[] {
  const hiddenNotices = getHiddenNotices();
  const hiddenIds = new Set(hiddenNotices.map(n => n.noticeId));
  return notices.filter(notice => !hiddenIds.has(notice.id));
}
