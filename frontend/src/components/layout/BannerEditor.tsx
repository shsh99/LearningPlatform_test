import { useState, useCallback, useRef } from 'react';
import type { TenantBannerConfig, BannerAreaConfig, BannerSlide } from '../../types/layout';
import { DEFAULT_BANNER_AREA } from '../../types/layout';
import { BannerCarousel } from './BannerCarousel';
import { uploadBannerImage, getFullFileUrl } from '../../api/file';
import { useTenant } from '../../contexts/TenantContext';

interface BannerEditorProps {
  config: TenantBannerConfig;
  onChange: (config: TenantBannerConfig) => void;
}

/**
 * 배너 편집 컴포넌트
 * 테넌트 관리자가 상단/하단 배너를 설정할 수 있는 UI
 */
export function BannerEditor({ config, onChange }: BannerEditorProps) {
  const { branding } = useTenant();
  const tenantId = branding?.tenantId || 1;
  const [activePosition, setActivePosition] = useState<'top' | 'bottom'>('top');
  const [showPreview, setShowPreview] = useState(false);

  // 현재 선택된 위치의 배너 설정
  const currentConfig = activePosition === 'top' ? config.top : config.bottom;
  const currentBanner: BannerAreaConfig = currentConfig || { ...DEFAULT_BANNER_AREA };

  // 배너 영역 설정 업데이트
  const updateAreaConfig = useCallback(
    (updates: Partial<BannerAreaConfig>) => {
      const newConfig = { ...config };
      if (activePosition === 'top') {
        newConfig.top = { ...currentBanner, ...updates };
      } else {
        newConfig.bottom = { ...currentBanner, ...updates };
      }
      onChange(newConfig);
    },
    [config, currentBanner, activePosition, onChange]
  );

  // 슬라이드 추가
  const addSlide = useCallback(() => {
    const newSlide: BannerSlide = {
      id: `slide-${Date.now()}`,
      enabled: true,
      order: currentBanner.slides.length + 1,
      title: '',
      content: '',
      imageUrl: '',
      linkUrl: '',
      backgroundColor: '#f3f4f6',
      textColor: '#374151',
    };
    updateAreaConfig({ slides: [...currentBanner.slides, newSlide] });
  }, [currentBanner.slides, updateAreaConfig]);

  // 슬라이드 삭제
  const removeSlide = useCallback(
    (slideId: string) => {
      const newSlides = currentBanner.slides.filter((s) => s.id !== slideId);
      updateAreaConfig({ slides: newSlides });
    },
    [currentBanner.slides, updateAreaConfig]
  );

  // 슬라이드 업데이트
  const updateSlide = useCallback(
    (slideId: string, updates: Partial<BannerSlide>) => {
      const newSlides = currentBanner.slides.map((slide) =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      );
      updateAreaConfig({ slides: newSlides });
    },
    [currentBanner.slides, updateAreaConfig]
  );

  // 슬라이드 순서 변경
  const moveSlide = useCallback(
    (slideId: string, direction: 'up' | 'down') => {
      const slides = [...currentBanner.slides];
      const index = slides.findIndex((s) => s.id === slideId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= slides.length) return;

      [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
      slides.forEach((s, i) => (s.order = i + 1));
      updateAreaConfig({ slides });
    },
    [currentBanner.slides, updateAreaConfig]
  );

  return (
    <div className="space-y-6">
      {/* 위치 탭 */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActivePosition('top')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activePosition === 'top'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          상단 배너
        </button>
        <button
          onClick={() => setActivePosition('bottom')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activePosition === 'bottom'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          하단 배너
        </button>
      </div>

      {/* 배너 활성화 토글 */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">
            {activePosition === 'top' ? '상단' : '하단'} 배너 활성화
          </h4>
          <p className="text-sm text-gray-500">
            모든 사용자에게 표시되는 공통 배너입니다
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={currentBanner.enabled}
            onChange={(e) => updateAreaConfig({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {currentBanner.enabled && (
        <>
          {/* 자동 재생 설정 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentBanner.autoPlay}
                onChange={(e) => updateAreaConfig({ autoPlay: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">자동 재생</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">재생 간격:</label>
              <input
                type="number"
                min={1000}
                step={500}
                value={currentBanner.autoPlayInterval || 5000}
                onChange={(e) =>
                  updateAreaConfig({ autoPlayInterval: parseInt(e.target.value) || 5000 })
                }
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-xs text-gray-500">ms</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentBanner.showArrows}
                  onChange={(e) => updateAreaConfig({ showArrows: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">화살표</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentBanner.showDots}
                  onChange={(e) => updateAreaConfig({ showDots: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">인디케이터</span>
              </label>
            </div>
          </div>

          {/* 슬라이드 목록 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">슬라이드 목록</h4>
              <button
                onClick={addSlide}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                슬라이드 추가
              </button>
            </div>

            {currentBanner.slides.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                슬라이드가 없습니다. 새 슬라이드를 추가해주세요.
              </div>
            ) : (
              <div className="space-y-4">
                {currentBanner.slides
                  .sort((a, b) => a.order - b.order)
                  .map((slide, index) => (
                    <SlideEditor
                      key={slide.id}
                      slide={slide}
                      index={index}
                      total={currentBanner.slides.length}
                      tenantId={tenantId}
                      onUpdate={(updates) => updateSlide(slide.id, updates)}
                      onRemove={() => removeSlide(slide.id)}
                      onMove={(direction) => moveSlide(slide.id, direction)}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* 미리보기 */}
          {currentBanner.slides.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showPreview ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                미리보기 {showPreview ? '닫기' : '보기'}
              </button>

              {showPreview && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <BannerCarousel config={currentBanner} position={activePosition} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * 개별 슬라이드 편집 컴포넌트
 */
interface SlideEditorProps {
  slide: BannerSlide;
  index: number;
  total: number;
  tenantId: number;
  onUpdate: (updates: Partial<BannerSlide>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

function SlideEditor({ slide, index, total, tenantId, onUpdate, onRemove, onMove }: SlideEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await uploadBannerImage(file, tenantId);
      onUpdate({ imageUrl: response.url });
    } catch (error) {
      console.error('Failed to upload banner image:', error);
      setUploadError('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="font-medium text-gray-700">
            슬라이드 {index + 1}
            {slide.title && `: ${slide.title}`}
          </span>
          <label className="flex items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={slide.enabled}
              onChange={(e) => onUpdate({ enabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-600">활성화</span>
          </label>
        </div>

        <div className="flex items-center gap-1">
          {/* 순서 변경 버튼 */}
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="위로 이동"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === total - 1}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="아래로 이동"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* 삭제 버튼 */}
          <button
            onClick={onRemove}
            className="p-1.5 text-red-400 hover:text-red-600"
            title="슬라이드 삭제"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 편집 영역 */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                type="text"
                value={slide.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="배너 제목"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 링크 URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
              <input
                type="url"
                value={slide.linkUrl || ''}
                onChange={(e) => onUpdate({ linkUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              value={slide.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="배너 내용을 입력하세요"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">배너 이미지</label>
            <div className="space-y-3">
              {/* 파일 업로드 */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      이미지 업로드
                    </>
                  )}
                </button>
                <span className="text-xs text-gray-500">또는 URL 직접 입력</span>
              </div>
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              {/* URL 입력 */}
              <input
                type="url"
                value={slide.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {/* 이미지 미리보기 */}
              {slide.imageUrl && (
                <div className="relative">
                  <img
                    src={getFullFileUrl(slide.imageUrl) || slide.imageUrl}
                    alt="미리보기"
                    className="max-h-40 rounded border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onUpdate({ imageUrl: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title="이미지 제거"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 색상 설정 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배경색</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={slide.backgroundColor || '#f3f4f6'}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={slide.backgroundColor || '#f3f4f6'}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">텍스트 색상</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={slide.textColor || '#374151'}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={slide.textColor || '#374151'}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
