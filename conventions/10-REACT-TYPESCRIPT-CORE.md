# 10. React + TypeScript Core Conventions

**베이스**: Airbnb React/JSX Style Guide + TypeScript Best Practices

---

## 네이밍

```typescript
// 파일: PascalCase
UserProfile.tsx, useUserData.ts, user.types.ts

// 컴포넌트/타입: PascalCase
export const UserProfile = () => { };
interface UserProps { }

// 함수/변수: camelCase
const getUserData = () => { };
const isLoading = false;

// 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
```

---

## 컴포넌트 기본 구조

```typescript
// 1. Import
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types';
import { userService } from '@/services/userService';

// 2. Types
interface UserProfileProps {
  userId: number;
}

// 3. Component
export const UserProfile = ({ userId }: UserProfileProps) => {
  // ✅ 서버 상태: React Query 사용 (useState 금지)
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
  });

  // ✅ UI 상태: useState 허용 (토글, 모달 열림 등)
  const [isEditing, setIsEditing] = useState(false);

  // Early return
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  // JSX
  return <div>{user.name}</div>;
};
```

> **서버 상태 vs UI 상태**
> - 서버 상태 (API 데이터): React Query 사용
> - UI 상태 (토글, 모달, 폼 입력): useState 허용

---

## TypeScript 규칙

```typescript
// ✅ 명시적 타입
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

// ❌ any 금지
const data: any = {}; // ❌

// ✅ unknown 또는 제네릭
const data: unknown = {};
function getData<T>(): T { }

// ✅ Union Types
type Status = 'idle' | 'loading' | 'success' | 'error';
```

---

## Props

```typescript
// ✅ Destructuring + Default
export const Button = ({
  children,
  onClick,
  disabled = false
}: ButtonProps) => {
  return <button onClick={onClick} disabled={disabled}>{children}</button>;
};

// ✅ Children 타입
interface CardProps {
  children: React.ReactNode;
}
```

---

## Hooks

```typescript
// ✅ 최상위에서만 호출 (조건문 안 금지)
const [isOpen, setIsOpen] = useState(false);  // UI 상태

// ✅ 커스텀 훅: use로 시작 (서버 상태는 React Query 래핑)
const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
  });
};

// ✅ 의존성 배열 정확히
useEffect(() => {
  // 서버 데이터 fetch가 아닌 side effect만
  document.title = `User ${userId}`;
}, [userId]);
```

---

## State 불변성

```typescript
// ✅ 객체 업데이트
setForm(prev => ({ ...prev, name: 'New' }));

// ✅ 배열 업데이트
setItems(prev => [...prev, newItem]);           // 추가
setItems(prev => prev.filter(i => i.id !== id)); // 삭제

// ❌ 직접 수정 금지
form.name = 'New'; // ❌
```

---

## 조건부 렌더링

```typescript
// ✅ Early return
if (isLoading) return <Spinner />;
if (error) return <Error />;

// ✅ 삼항 / && 연산자
{isLoggedIn ? <Profile /> : <Login />}
{hasError && <ErrorMessage />}

// ⚠️ falsy 값 주의
{count > 0 && <div>{count}</div>} // ✅
{count && <div>{count}</div>}     // ❌ 0이면 "0" 렌더링
```

---

## 리스트 렌더링

```typescript
// ✅ 고유한 key
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ index를 key로 사용 금지
```

---

## 이벤트 핸들러

```typescript
// ✅ 네이밍: handle + 동사
const handleClick = () => { };
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

// ✅ 타입 명시
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

---

## Import 순서

```typescript
import React, { useState } from 'react';        // 1. React
import { useNavigate } from 'react-router-dom'; // 2. 외부 라이브러리
import { Button } from '@/components/common';   // 3. 절대 경로 (@/)
import { userService } from './userService';    // 4. 상대 경로
import type { User } from '@/types';            // 5. 타입
```

---

## 상세 컨벤션 참조

- Component: [12-REACT-COMPONENT-CONVENTIONS.md](./12-REACT-COMPONENT-CONVENTIONS.md)
- State: [13-REACT-STATE-MANAGEMENT.md](./13-REACT-STATE-MANAGEMENT.md)
- API: [14-REACT-API-INTEGRATION.md](./14-REACT-API-INTEGRATION.md)
- Test: [16-FRONTEND-TEST-CONVENTIONS.md](./16-FRONTEND-TEST-CONVENTIONS.md)
