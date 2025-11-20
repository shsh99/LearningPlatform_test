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

// ✅ 불변성 유지
const [form, setForm] = useState({ name: '', email: '' });

setForm(prev => ({
  ...prev,
  name: 'New Name',
}));

// ✅ 배열 업데이트
setItems(prev => [...prev, newItem]);               // 추가
setItems(prev => prev.filter(i => i.id !== id));    // 삭제
setItems(prev => prev.map(i => i.id === id ? updated : i)); // 수정
```

---

## 3. useReducer (복잡한 상태)

```typescript
interface State {
  count: number;
  isLoading: boolean;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setLoading'; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'setLoading':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0, isLoading: false });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
};
```

---

## 4. Context API (공유 상태)

```typescript
// 1. Context 생성
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// 2. Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// 4. 사용
const Header = () => {
  const { user, logout } = useAuth();
  return <button onClick={logout}>{user?.name}</button>;
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
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: CreateUserRequest) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await userService.getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addUser: async (request) => {
    const newUser = await userService.createUser(request);
    set((state) => ({ users: [...state.users, newUser] }));
  },
}));

// 사용
const UserList = () => {
  const { users, isLoading, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>;
};
```

### Zustand Middleware

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// ✅ LocalStorage 저장 + DevTools
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        login: async (email, password) => {
          const user = await authService.login(email, password);
          set({ user });
        },
      }),
      { name: 'auth-storage' }
    )
  )
);
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

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUser(userId),
    enabled: !!userId, // userId 있을 때만 실행
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

### useMutation (변경)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateUserRequest) => userService.createUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // 캐시 무효화
    },
  });
};

// 사용
const CreateUserForm = () => {
  const createUser = useCreateUser();

  const handleSubmit = async (data: CreateUserRequest) => {
    await createUser.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <button disabled={createUser.isPending}>Create</button>
    </form>
  );
};
```

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

---

## 체크리스트

- [ ] 상태 분류에 따라 도구 선택
- [ ] 불변성 유지
- [ ] Context는 Custom Hook 래핑
- [ ] React Query queryKey 명확히

---

## 다음 문서

- [10-REACT-TYPESCRIPT-CORE.md](./10-REACT-TYPESCRIPT-CORE.md) - 핵심 규칙
- [11-REACT-PROJECT-STRUCTURE.md](./11-REACT-PROJECT-STRUCTURE.md) - 프로젝트 구조
- [12-REACT-COMPONENT-CONVENTIONS.md](./12-REACT-COMPONENT-CONVENTIONS.md) - 컴포넌트
- [14-REACT-API-INTEGRATION.md](./14-REACT-API-INTEGRATION.md) - API 통신
