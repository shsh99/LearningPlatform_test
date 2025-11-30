# 17. Design Implementation Conventions

> Frontend 디자인 구현 - TailwindCSS + MCP 연동

---

## 핵심 규칙

```
✅ 디자인 토큰 사용 → 하드코딩 금지
✅ MCP로 Figma 값 조회 → 최신 디자인 반영
✅ 컴포넌트 재사용 → 중복 스타일 금지
✅ 반응형 필수 → 모바일 우선 접근
```

---

## 스타일링

### TailwindCSS + CSS 변수

```typescript
// ✅ 디자인 토큰 사용
<button className="bg-primary text-white rounded-md px-4 py-2">

// ❌ 하드코딩 금지
<button className="bg-[#3B82F6] rounded-[8px]">
```

### CSS 변수 (globals.css)
```css
:root {
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-error: #EF4444;
  --spacing-md: 16px;
  --radius-md: 8px;
}
```

### Tailwind Config
```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
      },
    },
  },
}
```

---

## 컴포넌트 패턴 (CVA)

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'bg-gray-100 hover:bg-gray-200',
        danger: 'bg-error text-white',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);
```

### cn 유틸리티
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

---

## 반응형 (모바일 우선)

```typescript
// ✅ 모바일 → 데스크톱
<div className="px-4 md:px-6 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 숨기기/보이기
<nav className="hidden md:flex">데스크톱</nav>
<nav className="md:hidden">모바일</nav>
```

---

## 상태 스타일링

```typescript
// 버튼
<button className="
  hover:bg-primary-hover
  focus:ring-2 focus:ring-primary
  disabled:opacity-50 disabled:cursor-not-allowed
">

// 입력 필드
<input className={cn(
  'border rounded-md px-3 py-2',
  error && 'border-error',
  !error && 'border-gray-300 focus:ring-primary'
)} />
```

---

## 레이아웃

```typescript
// 페이지
<div className="min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
  <Footer />
</div>

// 자동 그리드
<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">

// 센터링
<div className="flex items-center justify-center min-h-screen">
```

---

## MCP 워크플로우

```
1. mcp__figma__get_styles() → CSS 변수 업데이트
2. mcp__figma__get_component("Button") → 구현
3. mcp__figma__get_frame("Login") → 검증
```

---

## 체크리스트

- [ ] Figma 컴포넌트 확인 (MCP)
- [ ] 디자인 토큰 사용 (하드코딩 금지)
- [ ] 반응형 적용
- [ ] 상태 스타일 (hover, focus, disabled)
- [ ] Figma 비교 검증

---

> 디자인 토큰 → [design.md](../docs/context/design.md)
> 컴포넌트 → [12-REACT-COMPONENT-CONVENTIONS](./12-REACT-COMPONENT-CONVENTIONS.md)
