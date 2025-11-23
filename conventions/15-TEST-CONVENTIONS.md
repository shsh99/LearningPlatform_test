# 15. Test Conventions

**베이스**: Spring Boot Testing (JUnit5, MockMvc) + React Testing Library

---

## 🔵 Backend Testing (Spring Boot + JUnit5)

### 1. 테스트 레이어 분류

```
Unit Test       → @WebMvcTest, @DataJpaTest
Integration Test → @SpringBootTest
```

---

### 2. Controller Test (@WebMvcTest)

```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("사용자 목록 조회")
    void getUserList() throws Exception {
        // given
        List<UserResponse> users = List.of(
            new UserResponse(1L, "John", "john@example.com")
        );
        given(userService.findAll()).willReturn(users);

        // when & then
        mockMvc.perform(get("/api/users")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[0].name").value("John"));
    }

    @Test
    @DisplayName("사용자 생성")
    void createUser() throws Exception {
        // given
        CreateUserRequest request = new CreateUserRequest("John", "john@example.com");
        UserResponse response = new UserResponse(1L, "John", "john@example.com");
        given(userService.create(any())).willReturn(response);

        // when & then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "John",
                      "email": "john@example.com"
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1L));
    }
}
```

---

### 3. Service Test

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("ID로 사용자 조회")
    void findById() {
        // given
        User user = User.create("John", "john@example.com");
        given(userRepository.findById(1L)).willReturn(Optional.of(user));

        // when
        UserResponse result = userService.findById(1L);

        // then
        assertThat(result.name()).isEqualTo("John");
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("존재하지 않는 사용자 조회 시 예외")
    void findByIdNotFound() {
        // given
        given(userRepository.findById(999L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.findById(999L))
            .isInstanceOf(UserNotFoundException.class);
    }
}
```

---

### 4. Repository Test (@DataJpaTest)

```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("이메일로 사용자 조회")
    void findByEmail() {
        // given
        User user = User.create("John", "john@example.com");
        userRepository.save(user);

        // when
        Optional<User> result = userRepository.findByEmail("john@example.com");

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("John");
    }
}
```

---

### 5. 테스트 네이밍

```java
// ✅ @DisplayName 사용 (한글 가능)
@Test
@DisplayName("사용자 생성 시 이메일 중복이면 예외 발생")
void createUserWithDuplicateEmail() { }

// ✅ 메서드명: 동사 + 조건 + 결과
@Test
void createUser_WhenEmailDuplicated_ThrowsException() { }
```

---

### 6. Given-When-Then 패턴

```java
@Test
void test() {
    // given (준비): 테스트 데이터 및 Mock 설정
    User user = User.create("John", "john@example.com");
    given(userRepository.findById(1L)).willReturn(Optional.of(user));

    // when (실행): 테스트 대상 메서드 실행
    UserResponse result = userService.findById(1L);

    // then (검증): 결과 검증
    assertThat(result.name()).isEqualTo("John");
    verify(userRepository).findById(1L);
}
```

---

## 🟢 Frontend Testing (React + Jest + RTL)

### 1. 컴포넌트 Test

```typescript
// UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
  };

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

### 2. Custom Hook Test

```typescript
// useUser.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';
import { userService } from '@/services/userService';

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

### 3. API Mock (MSW 권장)

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
    return HttpResponse.json(
      { id: 1, ...body },
      { status: 201 }
    );
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

### 4. 쿼리 우선순위 (React Testing Library)

```typescript
// ✅ 1순위: getByRole (접근성 테스트)
screen.getByRole('button', { name: /submit/i });

// ✅ 2순위: getByLabelText (폼 요소)
screen.getByLabelText('Email');

// ✅ 3순위: getByPlaceholderText
screen.getByPlaceholderText('Enter email');

// ✅ 4순위: getByText
screen.getByText('Welcome');

// ❌ 마지막 수단: getByTestId
screen.getByTestId('user-card');
```

---

### 5. userEvent vs fireEvent

```typescript
// ✅ userEvent 사용 (실제 사용자 동작 시뮬레이션)
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(button);
await user.type(input, 'Hello');

// ❌ fireEvent는 최소한으로
fireEvent.click(button);
```

---

## 공통 규칙

### 1. 테스트 독립성

```
✅ 각 테스트는 독립적으로 실행 가능
✅ 테스트 간 데이터 공유 금지
✅ 실행 순서에 의존하지 않음
```

### 2. 하나의 테스트, 하나의 검증

```java
// ❌ 여러 것을 동시에 테스트
@Test
void testUserCRUD() {
    // create, read, update, delete 모두 테스트
}

// ✅ 분리
@Test void createUser() { }
@Test void findUser() { }
@Test void updateUser() { }
@Test void deleteUser() { }
```

### 3. 의미 있는 실패 메시지

```java
// ✅ 명확한 메시지
assertThat(user.getEmail())
    .as("사용자 이메일은 john@example.com이어야 함")
    .isEqualTo("john@example.com");
```

---

## 참고 자료

**Backend**
- [Spring Boot Testing Guide](https://spring.io/guides/gs/testing-web/)
- [Baeldung Spring Testing](https://www.baeldung.com/spring-boot-testing)

**Frontend**
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/tutorial-react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
