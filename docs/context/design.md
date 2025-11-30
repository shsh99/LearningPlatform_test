# Design Context - 디자인 시스템 & UI 규칙

> AI가 UI 생성/수정 시 따라야 할 규칙. MCP(Figma)와 연동하여 실제 값 조회 후 구현

---

## 1. 핵심 원칙 (필수)

### 금지 사항
```tsx
// ❌ 임의값 하드코딩
<div className="bg-[#4F46E5] p-[18px]">
// ❌ 인라인 스타일
<div style={{ color: 'blue' }}>
// ❌ 페이지에 직접 스타일
<button className="bg-primary px-4 py-2">저장</button>
```

### 올바른 사용
```tsx
// ✅ 시맨틱 토큰 + ui 컴포넌트
import { Button } from '@/components/ui';
<Button variant="primary">저장</Button>
<div className="bg-surface text-text-primary rounded-lg">
```

---

## 2. 디자인 토큰

> 실제 값은 `tailwind.config.ts` 또는 MCP로 조회

### Colors
| 토큰 | Tailwind | 용도 |
|------|----------|------|
| `primary` | `bg-primary` | 브랜드, CTA |
| `primary-hover` | `hover:bg-primary-hover` | 호버 상태 |
| `secondary` | `bg-secondary` | 보조 버튼 |
| `background` | `bg-background` | 페이지 배경 |
| `surface` | `bg-surface` | 카드 배경 |
| `border` | `border-border` | 테두리 |
| `text-primary` | `text-text-primary` | 본문 |
| `text-secondary` | `text-text-secondary` | 보조 텍스트 |
| `text-muted` | `text-text-muted` | 플레이스홀더 |
| `error` / `success` / `warning` | `bg-error`, `text-error` | 상태 표시 |

### Typography
| 용도 | Tailwind |
|------|----------|
| 페이지 제목 | `text-2xl font-bold` |
| 섹션 제목 | `text-xl font-semibold` |
| 카드 제목 | `text-lg font-semibold` |
| 본문 / 작은 본문 | `text-base` / `text-sm` |
| 캡션 | `text-xs` |

### Spacing & Radius
| 용도 | Tailwind |
|------|----------|
| 아이콘-텍스트 | `gap-1` (4px) |
| 요소 내부 | `p-2` (8px) |
| 요소 간 | `gap-4` (16px) |
| 섹션 간 | `p-8` (32px) |
| 버튼/입력 | `rounded-md` |
| 카드/모달 | `rounded-lg shadow-sm` |

---

## 3. 컴포넌트

### 현재 컴포넌트 & Figma 매핑
| 컴포넌트 | 파일 | variants | Figma |
|----------|------|----------|-------|
| `Button` | `ui/Button.tsx` | primary, secondary, danger, ghost | `Components/Button` |
| `Input` | `ui/Input.tsx` | error 상태 | `Components/Input` |
| `Card` | `ui/Card.tsx` | hover 옵션 | `Components/Card` |
| `Modal` | `ui/Modal.tsx` | - | `Components/Modal` |
| `Toast` | `ui/Toast.tsx` | success, error, warning, info | `Components/Toast` |
| `Badge` | `ui/Badge.tsx` | status variants | `Components/Badge` |
| `Avatar` | `ui/Avatar.tsx` | sm, md, lg | `Components/Avatar` |

### 새 컴포넌트 추가
```tsx
// src/components/ui/에 생성, variants 패턴 사용
const variants = { default: "bg-gray-100", primary: "bg-primary/10 text-primary" };
export function Tag({ variant = "default", children }: TagProps) {
  return <span className={`${variants[variant]} px-2 py-1 text-xs rounded-sm`}>{children}</span>;
}
```

### 페이지 작성
```tsx
// 페이지는 ui 컴포넌트 조합만
import { Button, Card, Input } from '@/components/ui';
<Card><Input label="제목" /><Button variant="primary">저장</Button></Card>
```

---

## 4. 레이아웃

### 페이지 구조
```tsx
<div className="min-h-screen bg-background">
  <Navbar />
  <main className="flex-1 p-8"><div className="max-w-7xl mx-auto">{/* 콘텐츠 */}</div></main>
  <Footer />
</div>
```

### 페이지 Figma 매핑
| 페이지 | Figma Frame | 파일 |
|--------|-------------|------|
| 로그인/회원가입 | `Auth/Login`, `Auth/Signup` | `pages/auth/*.tsx` |
| 홈 | `Main/Home` | `pages/HomePage.tsx` |
| 강의 목록/상세 | `Course/List`, `Course/Detail` | `pages/course/*.tsx` |
| 마이페이지 | `User/MyPage` | `pages/mypage/MyPage.tsx` |

### 반응형
| Tailwind | 범위 | 용도 |
|----------|------|------|
| 기본 | ~639px | 모바일 |
| `sm:` | 640px+ | 태블릿 |
| `lg:` | 1024px+ | 데스크톱 |

---

## 5. 아이콘

```tsx
import { Search, User } from 'lucide-react';
<Search className="w-5 h-5 text-text-secondary" />
```

---

## 6. MCP 연동 (Figma)

### 프로젝트 정보
| 항목 | 값 |
|------|-----|
| File Key | `YOUR_FIGMA_FILE_KEY` (URL `/file/` 뒤) |
| Project URL | `https://www.figma.com/file/YOUR_FILE_KEY/LearningPlatform` |

### MCP 명령어
```bash
mcp__figma__get_component("Button/Primary")  # 컴포넌트 조회
mcp__figma__get_styles()                      # 토큰 조회
mcp__figma__get_frame("Login Page")           # 프레임 조회
```

### Figma 적용 시 변경 범위
| 파일 | 변경 |
|------|------|
| `tailwind.config.ts` | 토큰 값 교체 |
| `components/ui/*` | 클래스 일부 수정 |
| `pages/*` | **수정 없음** |

---

## 7. AI 체크리스트

**코딩 중**
- [ ] 임의값(`[#xxx]`, `[18px]`) 사용 안 함
- [ ] 인라인 스타일 안 씀
- [ ] ui 컴포넌트로 작성
- [ ] 새 요소는 variants 패턴

**코딩 후**
- [ ] 상태 확인 (hover, focus, disabled)
- [ ] 반응형 테스트

---

## 관련 문서

- [17-DESIGN-CONVENTIONS](../../conventions/17-DESIGN-CONVENTIONS.md)
- [12-REACT-COMPONENT-CONVENTIONS](../../conventions/12-REACT-COMPONENT-CONVENTIONS.md)

---

*v1.0.0 | 2025-01-27*
