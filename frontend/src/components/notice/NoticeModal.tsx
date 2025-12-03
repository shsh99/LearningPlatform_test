import { useState, useEffect } from 'react';
import type { Notice } from '../../types/notice';
import { hideNoticeForToday, filterVisibleNotices } from '../../types/notice';

interface NoticeModalProps {
  notices: Notice[];
  onClose: () => void;
}

export function NoticeModal({ notices, onClose }: NoticeModalProps) {
  // 초기값을 바로 필터링된 결과로 설정
  const [visibleNotices, setVisibleNotices] = useState<Notice[]>(() =>
    filterVisibleNotices(notices)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hideToday, setHideToday] = useState(false);

  // notices가 변경되면 다시 필터링
  useEffect(() => {
    const filtered = filterVisibleNotices(notices);
    setVisibleNotices(filtered);

    // 필터링 후 공지가 없으면 모달 닫기
    if (filtered.length === 0) {
      onClose();
    }
  }, [notices, onClose]);

  const currentNotice = visibleNotices[currentIndex];

  const handleClose = () => {
    if (hideToday && currentNotice) {
      hideNoticeForToday(currentNotice.id);
    }
    onClose();
  };

  const handleNext = () => {
    if (hideToday && currentNotice) {
      hideNoticeForToday(currentNotice.id);
    }
    setHideToday(false);

    if (currentIndex < visibleNotices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (visibleNotices.length === 0 || !currentNotice) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">공지사항</h2>
              {visibleNotices.length > 1 && (
                <p className="text-sm text-blue-100">
                  {currentIndex + 1} / {visibleNotices.length}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* 공지 타입 뱃지 */}
            <div className="flex items-center gap-2">
              {currentNotice.type === 'SYSTEM' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  시스템 공지
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  테넌트 공지
                </span>
              )}
              {currentNotice.startDate && (
                <span className="text-sm text-gray-500">
                  {new Date(currentNotice.startDate).toLocaleDateString('ko-KR')}
                </span>
              )}
            </div>

            {/* 제목 */}
            <h3 className="text-2xl font-bold text-gray-900">
              {currentNotice.title}
            </h3>

            {/* 내용 */}
            <div className="prose prose-gray max-w-none">
              <div
                className="text-gray-700 whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentNotice.content }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            {/* 오늘 그만 보기 체크박스 */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideToday}
                onChange={(e) => setHideToday(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">오늘 하루 보지 않기</span>
            </label>

            {/* 버튼 그룹 */}
            <div className="flex items-center gap-2">
              {visibleNotices.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    이전
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentIndex < visibleNotices.length - 1 ? '다음' : '확인'}
                  </button>
                </>
              )}
              {visibleNotices.length === 1 && (
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  확인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
