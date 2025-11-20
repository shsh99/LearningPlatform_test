# 14. React API Integration

**베이스**: Axios + React Query

---

## 1. Axios 설정

```typescript
// services/api/axiosInstance.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (토큰 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (에러 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 2. API Endpoints

```typescript
// services/api/endpoints.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  USER_BY_ID: (id: number) => `/api/users/${id}`,
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
} as const;
```

---

## 3. Service Layer

```typescript
// services/userService.ts
import { axiosInstance } from './api/axiosInstance';
import { API_ENDPOINTS } from './api/endpoints';
import type { User, CreateUserRequest } from '@/types/user.types';

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data } = await axiosInstance.get<User[]>(API_ENDPOINTS.USERS);
    return data;
  },

  async getUser(id: number): Promise<User> {
    const { data } = await axiosInstance.get<User>(API_ENDPOINTS.USER_BY_ID(id));
    return data;
  },

  async createUser(request: CreateUserRequest): Promise<User> {
    const { data } = await axiosInstance.post<User>(API_ENDPOINTS.USERS, request);
    return data;
  },

  async updateUser(id: number, request: UpdateUserRequest): Promise<User> {
    const { data } = await axiosInstance.put<User>(
      API_ENDPOINTS.USER_BY_ID(id),
      request
    );
    return data;
  },

  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.USER_BY_ID(id));
  },
};
```

---

## 4. React Query 사용

### Query Hooks (조회)

```typescript
// hooks/queries/useUsersQuery.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });
};

export const useUserQuery = (userId: number) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUser(userId),
    enabled: !!userId,
  });
};
```

### Mutation Hooks (변경)

```typescript
// hooks/mutations/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateUserRequest) => userService.createUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### 사용 예시

```typescript
// pages/UserList.tsx
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useDeleteUserMutation } from '@/hooks/mutations/useUserMutations';

export const UserList = () => {
  const { data: users, isLoading, error } = useUsersQuery();
  const deleteUser = useDeleteUserMutation();

  const handleDelete = async (id: number) => {
    await deleteUser.mutateAsync(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};
```

---

## 5. Custom Hooks (React Query 미사용 시)

```typescript
// hooks/useUser.ts
import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import type { User } from '@/types/user.types';

export const useUser = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await userService.getUser(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'));
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  return { user, isLoading, error };
};
```

---

## 6. 에러 처리

```typescript
// utils/errorHandler.ts
import { AxiosError } from 'axios';

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};

// 사용
try {
  await userService.createUser(data);
} catch (error) {
  const errorMessage = handleApiError(error);
  alert(errorMessage);
}
```

---

## 7. 로딩 & 에러 컴포넌트

```typescript
// components/common/LoadingSpinner.tsx
export const LoadingSpinner = () => {
  return <div className="spinner">Loading...</div>;
};

// components/common/ErrorMessage.tsx
interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
  return (
    <div className="error">
      <p>Error: {error.message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
};
```

---

## 8. 파일 업로드

```typescript
// services/uploadService.ts
export const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.post<{ url: string }>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.url;
  },
};

// 사용
const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const url = await uploadService.uploadFile(file);
    alert(`Uploaded: ${url}`);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};
```

---

## 체크리스트

- [ ] Axios instance 설정
- [ ] Interceptor 구현
- [ ] Service Layer 분리
- [ ] React Query 사용 (권장)
- [ ] 에러 처리 일관성
- [ ] 로딩 상태 관리

---

## 다음 문서

- [10-REACT-TYPESCRIPT-CORE.md](./10-REACT-TYPESCRIPT-CORE.md) - 핵심 규칙
- [11-REACT-PROJECT-STRUCTURE.md](./11-REACT-PROJECT-STRUCTURE.md) - 프로젝트 구조
- [12-REACT-COMPONENT-CONVENTIONS.md](./12-REACT-COMPONENT-CONVENTIONS.md) - 컴포넌트
- [13-REACT-STATE-MANAGEMENT.md](./13-REACT-STATE-MANAGEMENT.md) - 상태 관리
