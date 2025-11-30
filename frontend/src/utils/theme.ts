/**
 * HEX 색상을 RGB로 변환
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * 색상의 밝기를 계산 (0-255)
 * 공식: (299*R + 587*G + 114*B) / 1000
 */
function getBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 255; // 기본값은 밝은 색상으로 간주

  return (299 * rgb.r + 587 * rgb.g + 114 * rgb.b) / 1000;
}

/**
 * 색상이 어두운지 판단
 * @param hex - HEX 색상 코드
 * @param threshold - 임계값 (기본 128, 0-255)
 * @returns true면 어두운 색상, false면 밝은 색상
 */
export function isDarkColor(hex: string, threshold: number = 128): boolean {
  return getBrightness(hex) < threshold;
}

/**
 * 브랜딩 헤더 색상을 기반으로 다크 테마 여부 판단
 */
export function isDarkTheme(headerBgColor: string): boolean {
  return isDarkColor(headerBgColor);
}

/**
 * Primary Color 기반 테마 감지
 * 각 테마의 특징적인 primary 색상을 기반으로 테마를 판별합니다
 * @param primaryColor - Primary 색상
 * @param headerBgColor - Header 배경색
 * @param backgroundColor - 커스텀 배경색 (선택사항, 있으면 우선 적용)
 */
export function getThemeClass(primaryColor: string, headerBgColor: string, backgroundColor?: string): string {
  // 커스텀 배경색이 설정되어 있으면 무조건 사용
  if (backgroundColor && backgroundColor.trim() !== '') {
    return '';  // 빈 문자열 반환하여 inline style 사용하도록
  }

  // 색상을 대문자로 변환하여 비교
  const primary = primaryColor.toUpperCase();
  const header = headerBgColor.toUpperCase();

  // Cosmos 테마 (메가존 스타일): 검은 배경 + 에메랄드 그린
  if (header === '#000000' || header === '#191919') {
    return 'hero-dark';
  }

  // Midnight Blue: 어두운 배경 + 진한 파란색
  if (primary === '#1E3A8A' || primary === '#1E40AF') {
    return 'hero-midnight';
  }

  // Ocean Breeze: 하늘색/청록색
  if (primary === '#0EA5E9' || primary === '#06B6D4') {
    return 'hero-ocean';
  }

  // Forest: 녹색
  if (primary === '#059669' || primary === '#10B981') {
    return 'hero-forest';
  }

  // Sunset Glow: 오렌지색
  if (primary === '#F97316' || primary === '#FB923C') {
    return 'hero-sunset';
  }

  // Lavender Dream: 보라색
  if (primary === '#A855F7' || primary === '#C084FC') {
    return 'hero-lavender';
  }

  // Rose Garden: 핑크/로즈색
  if (primary === '#F43F5E' || primary === '#FB7185') {
    return 'hero-rose';
  }

  // Minimal Gray: 회색
  if (primary === '#525252' || primary === '#737373' || primary === '#A3A3A3') {
    return 'hero-minimal';
  }

  // 기본 테마 (화이트 배경)
  return 'bg-gray-50';
}

/**
 * 테마에 맞는 glow orb 색상 클래스 반환
 * @param primaryColor - Primary 색상
 * @param headerBgColor - Header 배경색
 * @param backgroundColor - 커스텀 배경색 (선택사항, 있으면 glow orb 표시 안함)
 */
export function getGlowOrbClasses(primaryColor: string, headerBgColor: string, backgroundColor?: string): { primary: string; secondary: string } {
  // 커스텀 배경색이 있으면 glow orb 표시 안함
  if (backgroundColor && backgroundColor.trim() !== '') {
    return { primary: '', secondary: '' };
  }

  const primary = primaryColor.toUpperCase();
  const header = headerBgColor.toUpperCase();

  if (header === '#000000' || header === '#191919') {
    return { primary: 'glow-orb-green', secondary: 'glow-orb-purple' };
  }

  if (primary === '#1E3A8A' || primary === '#1E40AF') {
    return { primary: 'glow-orb-midnight', secondary: 'glow-orb-blue' };
  }

  if (primary === '#0EA5E9' || primary === '#06B6D4') {
    return { primary: 'glow-orb-ocean', secondary: 'glow-orb-blue' };
  }

  if (primary === '#059669' || primary === '#10B981') {
    return { primary: 'glow-orb-forest', secondary: 'glow-orb-green' };
  }

  if (primary === '#F97316' || primary === '#FB923C') {
    return { primary: 'glow-orb-sunset', secondary: 'glow-orb-sunset' };
  }

  if (primary === '#A855F7' || primary === '#C084FC') {
    return { primary: 'glow-orb-lavender', secondary: 'glow-orb-purple' };
  }

  if (primary === '#F43F5E' || primary === '#FB7185') {
    return { primary: 'glow-orb-rose', secondary: 'glow-orb-rose' };
  }

  if (primary === '#525252' || primary === '#737373' || primary === '#A3A3A3') {
    return { primary: 'glow-orb-minimal', secondary: 'glow-orb-minimal' };
  }

  return { primary: '', secondary: '' };
}
