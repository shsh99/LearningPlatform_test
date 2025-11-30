# 13. React State Management

**베이스**: 상태 분류에 따른 도구 선택

---

## 1. 상태 분류

```
Local State    → useState, useReducer
Shared State   → Context API
Global State   → Zustand, Redux
Server State   → React Query, SWR
```

---

## 2. useState

```typescript
// ✅ 기본 사용
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// ✅ 객체/배열 업데이트 (불변성 유지)
setForm(prev => ({ ...prev, name: 'New Name' }));
setItems(prev => [...prev, newItem]);
setItems(prev => prev.filter(i => i.id !== id));
```

---

## 3. useReducer (복잡한 상태)

```typescript
interface State {
  count: number;
}

type Action = { type: 'increment' } | { type: 'decrement' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

export const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: 'increment' })}>+</button>;
};
```

---

## 4. Context API (공유 상태)

```typescript
// 1. Context 생성
interface AuthContextValue {
  user: User | null;
  login: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// 2. Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    const userData = await authService.login(email);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook + 사용
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## 5. Zustand (전역 상태)

```bash
npm install zustand
```

```typescript
// stores/userStore.ts
import { create } from 'zustand';

interface UserState {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (user: CreateUserRequest) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],

  fetchUsers: async () => {
    const users = await userService.getUsers();
    set({ users });
  },

  addUser: async (request) => {
    const newUser = await userService.createUser(request);
    set((state) => ({ users: [...state.users, newUser] }));
  },
}));

// 사용
const UserList = () => {
  const { users, fetchUsers } = useUserStore();
  return <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>;
};
```

---

## 6. React Query (서버 상태)

```bash
npm install @tanstack/react-query
```

### 기본 설정

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

### useQuery (조회)

```typescript
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });
};

// 사용
const UserList = () => {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
};
```

> **useMutation**은 [14-REACT-API-INTEGRATION.md](./14-REACT-API-INTEGRATION.md) 참조

---

## 7. 선택 가이드

```
📌 Local State (useState/useReducer)
  - 폼 입력, 모달 상태, 토글
  - 한 컴포넌트에서만 사용

📌 Context API
  - 테마, 언어 설정
  - Props drilling 해결
  - 자주 변경되지 않는 데이터

📌 Zustand
  - 전역 UI 상태
  - 인증 상태, 장바구니
  - Context보다 간단

📌 React Query
  - 서버 데이터 (API)
  - 캐싱, 자동 refetch
  - 비동기 데이터
```

