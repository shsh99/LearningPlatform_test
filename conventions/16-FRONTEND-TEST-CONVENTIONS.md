# 16. Frontend Test Conventions

**베이스**: React Testing Library + Jest + MSW

---

## 테스트 유형

| 유형 | 도구 | 용도 |
|------|------|------|
| Component | RTL + Jest | UI 렌더링, 이벤트 |
| Hook | renderHook | 커스텀 훅 |
| API Mock | MSW | 네트워크 요청 |

---

## Component Test

```typescript
// UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = { id: 1, name: 'John', email: 'john@example.com' };

  it('사용자 정보를 렌더링한다', () => {
    // Arrange
    render(<UserCard user={mockUser} />);

    // Assert
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 onEdit 호출', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={handleEdit} />);

    // Act
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Assert
    expect(handleEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

---

## Custom Hook Test

```typescript
// useUser.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';

jest.mock('@/services/userService');

describe('useUser', () => {
  it('사용자 데이터를 로드한다', async () => {
    // Arrange
    const mockUser = { id: 1, name: 'John' };
    (userService.getUser as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const { result } = renderHook(() => useUser(1));

    // Assert
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

---

## MSW (API Mock)

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John', email: 'john@example.com' },
    ]);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 1, ...body }, { status: 201 });
  }),
];

// setupTests.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 쿼리 우선순위

```typescript
// ✅ 1순위: getByRole (접근성)
screen.getByRole('button', { name: /submit/i });

// ✅ 2순위: getByLabelText (폼)
screen.getByLabelText('Email');

// ✅ 3순위: getByPlaceholderText
screen.getByPlaceholderText('Enter email');

// ✅ 4순위: getByText
screen.getByText('Welcome');

// ❌ 마지막 수단: getByTestId
screen.getByTestId('user-card');
```

---

## userEvent vs fireEvent

```typescript
// ✅ userEvent 사용 (실제 사용자 동작)
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(button);
await user.type(input, 'Hello');

// ❌ fireEvent는 최소한으로
fireEvent.click(button);
```

---

## Arrange-Act-Assert 패턴

```typescript
it('버튼 클릭 시 카운트 증가', async () => {
  // Arrange (준비)
  const user = userEvent.setup();
  render(<Counter />);

  // Act (실행)
  await user.click(screen.getByRole('button', { name: /increment/i }));

  // Assert (검증)
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

---

## 공통 규칙

```
✅ 각 테스트는 독립적으로 실행 가능
✅ 테스트 간 데이터 공유 금지
✅ 하나의 테스트, 하나의 검증
✅ 접근성 쿼리 우선 사용
```

---

## 참고 자료

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
