import { useState, useEffect, useCallback } from 'react';
import type { BannerSlide, BannerAreaConfig } from '../../types/layout';
import { getFullFileUrl } from '../../api/file';

interface BannerCarouselProps {
  config: BannerAreaConfig;
  position: 'top' | 'bottom';
}

/**
 * 배너 캐러셀 컴포넌트
 * 여러 슬라이드를 자동/수동으로 넘길 수 있는 광고형 배너
 */
export function BannerCarousel({ config, position }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 활성화되고 정렬된 슬라이드만 필터링
  const activeSlides = config.slides
    .filter((slide) => slide.enabled)
    .sort((a, b) => a.order - b.order);

  const slideCount = activeSlides.length;

  // 다음 슬라이드로 이동
  const goToNext = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  // 이전 슬라이드로 이동
  const goToPrev = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // 특정 슬라이드로 이동
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 자동 재생
  useEffect(() => {
    if (!config.autoPlay || isPaused || slideCount <= 1) return;

    const interval = setInterval(goToNext, config.autoPlayInterval || 5000);
    return () => clearInterval(interval);
  }, [config.autoPlay, config.autoPlayInterval, isPaused, slideCount, goToNext]);

  // 슬라이드가 없으면 렌더링하지 않음
  if (!config.enabled || slideCount === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderBottom: position === 'top' ? '1px solid rgba(0,0,0,0.1)' : 'none',
        borderTop: position === 'bottom' ? '1px solid rgba(0,0,0,0.1)' : 'none',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 슬라이드 컨테이너 */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeSlides.map((slide) => (
          <SlideItem key={slide.id} slide={slide} />
        ))}
      </div>

      {/* 화살표 네비게이션 */}
      {config.showArrows && slideCount > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="이전 슬라이드"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="다음 슬라이드"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 도트 인디케이터 */}
      {config.showDots && slideCount > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}

      {/* 현재 슬라이드 번호 */}
      {slideCount > 1 && (
        <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {slideCount}
        </div>
      )}
    </div>
  );
}

/**
 * 개별 슬라이드 아이템
 */
function SlideItem({ slide }: { slide: BannerSlide }) {
  const hasImage = !!slide.imageUrl;
  const hasContent = slide.title || slide.content;
  const imageUrl = getFullFileUrl(slide.imageUrl) || slide.imageUrl;

  const content = (
    <div
      className="w-full flex-shrink-0"
      style={{
        backgroundColor: slide.backgroundColor || '#f3f4f6',
        minHeight: hasImage ? '200px' : '80px',
      }}
    >
      {hasImage ? (
        // 이미지가 있는 경우
        <div className="relative w-full h-48 sm:h-56 md:h-64">
          <img
            src={imageUrl || ''}
            alt={slide.title || '배너 이미지'}
            className="w-full h-full object-cover"
          />
          {/* 이미지 위에 텍스트 오버레이 */}
          {hasContent && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
              <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {slide.title && (
                  <h3
                    className="text-lg sm:text-xl md:text-2xl font-bold"
                    style={{ color: slide.textColor || '#ffffff' }}
                  >
                    {slide.title}
                  </h3>
                )}
                {slide.content && (
                  <p
                    className="text-sm sm:text-base mt-1 line-clamp-2"
                    style={{ color: slide.textColor || '#ffffff', opacity: 0.9 }}
                  >
                    {slide.content}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // 텍스트만 있는 경우
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
          <div className="text-center">
            {slide.title && (
              <h3
                className="text-lg font-semibold"
                style={{ color: slide.textColor || '#374151' }}
              >
                {slide.title}
              </h3>
            )}
            {slide.content && (
              <p
                className="text-sm mt-1"
                style={{ color: slide.textColor || '#6b7280' }}
              >
                {slide.content}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // 링크가 있으면 a 태그로 감싸기
  if (slide.linkUrl) {
    return (
      <a
        href={slide.linkUrl}
        className="w-full flex-shrink-0 block cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return content;
}
