# 10. React + TypeScript Core Conventions

**베이스**: [Airbnb React/JSX Style Guide](https://airbnb.io/javascript/react/) + TypeScript Best Practices

---

## 1. 파일 및 네이밍

```typescript
// 📁 파일명: PascalCase
UserProfile.tsx
ProductCard.tsx
useUserData.ts      // 커스텀 훅
userService.ts      // 서비스
user.types.ts       // 타입

// 🔤 컴포넌트: PascalCase
export const UserProfile = () => { };

// 🔤 함수/변수: camelCase
const getUserData = () => { };
const isLoading = false;

// 🔤 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 🔤 Type/Interface: PascalCase
interface UserProps { }
type Status = 'pending' | 'success';

// 🔤 Props: camelCase (React 컴포넌트 값은 PascalCase)
<Component userName="John" onUpdate={handleUpdate} />
<Modal HeaderComponent={CustomHeader} />
```

---

## 2. 컴포넌트 작성

### 2.1 기본 구조

```typescript
// Import
import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import type { User } from '@/types/user.types';

// Types
interface UserProfileProps {
  userId: number;
}

// Component
export const UserProfile = ({ userId }: UserProfileProps) => {
  // State
  const [user, setUser] = useState<User | null>(null);

  // Effects
  useEffect(() => {
    loadUser();
  }, [userId]);

  // Handlers
  const loadUser = async () => {
    // ...
  };

  // Early return
  if (!user) return <div>Loading...</div>;

  // JSX
  return <div>{user.name}</div>;
};
```

### 2.2 파일당 하나의 컴포넌트

```typescript
// ✅ 권장
// UserCard.tsx
export const UserCard = () => { };

// ❌ 비권장 (단, 작은 서브 컴포넌트는 예외)
export const UserCard = () => { };
export const UserList = () => { };
```

---

## 3. TypeScript 규칙

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

// ✅ Optional vs Nullable 명확히
interface User {
  name: string;        // 필수
  email?: string;      // 있을 수도, 없을 수도
  phone: string | null; // null 허용
}
```

---

## 4. Props

```typescript
// ✅ Destructuring
export const Button = ({ children, onClick, disabled = false }: ButtonProps) => {
  return <button onClick={onClick} disabled={disabled}>{children}</button>;
};

// ✅ Rest props
const Button = ({ children, ...rest }: ButtonProps) => {
  return <button {...rest}>{children}</button>;
};

// ✅ Boolean props (true 생략 가능)
<Input disabled />           // ✅ disabled={true}와 동일
<Input disabled={false} />   // 명시적 false

// ✅ Children
interface CardProps {
  children: React.ReactNode;
}
```

---

## 5. Hooks

```typescript
// ✅ 최상위에서만 호출
const MyComponent = () => {
  const [count, setCount] = useState(0); // ✅

  if (count > 0) {
    // const [name, setName] = useState(''); // ❌
  }

  return <div>{count}</div>;
};

// ✅ 커스텀 훅: use로 시작
const useUser = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);
  // ...
  return { user };
};

// ✅ 의존성 배열 정확히
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId 변경 시에만
```

---

## 6. State 관리

```typescript
// ✅ 불변성 유지
const [form, setForm] = useState({ name: '', email: '' });

setForm(prev => ({
  ...prev,
  name: 'New Name',
}));

// ❌ 직접 수정 금지
form.name = 'New Name'; // ❌
setForm(form); // ❌

// ✅ 배열 업데이트
setItems(prev => [...prev, newItem]);           // 추가
setItems(prev => prev.filter(i => i.id !== id)); // 삭제
```

---

## 7. 조건부 렌더링

```typescript
// ✅ Early return
if (isLoading) return <Spinner />;
if (error) return <Error />;

// ✅ 삼항 연산자
{isLoggedIn ? <Profile /> : <Login />}

// ✅ && 연산자
{hasError && <ErrorMessage />}

// ⚠️ falsy 값 주의
{count && <div>{count}</div>}     // ❌ 0이면 "0" 렌더링
{count > 0 && <div>{count}</div>} // ✅
```

---

## 8. 리스트 렌더링

```typescript
// ✅ 고유한 key
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ index를 key로 사용 금지
{users.map((user, index) => (
  <UserCard key={index} user={user} /> // ❌
))}
```

---

## 9. 이벤트 핸들러

```typescript
// ✅ 네이밍: handle + 동사
const handleClick = () => { };
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

// ✅ Props: on + 동사
interface ButtonProps {
  onClick: () => void;
  onSubmit?: () => void;
}

// ✅ 타입 명시
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

---

## 10. Import/Export

```typescript
// ✅ Named Export 권장
export const Button = () => { };
export type { ButtonProps };

// ✅ Import 순서
import React, { useState } from 'react';           // 1. React
import { useNavigate } from 'react-router-dom';    // 2. 외부 라이브러리
import { Button } from '@/components/common';      // 3. 절대 경로 (@/)
import { userService } from './userService';       // 4. 상대 경로
import type { User } from '@/types';               // 5. 타입

// ❌ Default Export는 최소화 (페이지 컴포넌트 등만)
export default UserPage;
```

---

## 11. JSX 스타일

```typescript
// ✅ Props가 짧으면 한 줄
<Button onClick={handleClick}>Submit</Button>

// ✅ Props가 길면 여러 줄 (각각 indent)
<Button
  onClick={handleClick}
  disabled={isLoading}
  variant="primary"
>
  Submit
</Button>

// ✅ 자체 종료 태그에 공백
<Input />          // ✅
<Input/>           // ❌

// ✅ Children이 없으면 자체 종료
<Button />         // ✅
<Button></Button>  // ❌
```

---

## 12. 접근성

```typescript
// ✅ img에 alt 필수
<img src="avatar.jpg" alt="User avatar" />

// ✅ button에 type 명시
<button type="button">Click</button>
<button type="submit">Submit</button>

// ✅ label과 input 연결
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

