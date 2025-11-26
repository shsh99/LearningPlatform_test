# 15-1. Backend Test Conventions

**베이스**: Spring Boot Testing (JUnit5, MockMvc, AssertJ)

---

## 테스트 레이어 분류

| 레이어 | 애노테이션 | 용도 |
|--------|-----------|------|
| Controller | `@WebMvcTest` | MockMvc, 웹 레이어만 |
| Service | `@ExtendWith(MockitoExtension.class)` | 단위 테스트 |
| Repository | `@DataJpaTest` | JPA, H2 |
| Integration | `@SpringBootTest` | 전체 컨텍스트 |

---

## Controller Test

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
    @DisplayName("사용자 생성 - 201 Created")
    void createUser() throws Exception {
        // given
        UserResponse response = new UserResponse(1L, "John", "john@example.com");
        given(userService.create(any())).willReturn(response);

        // when & then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"name": "John", "email": "john@example.com"}
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1L));
    }
}
```

---

## Service Test

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
    @DisplayName("존재하지 않는 사용자 - 예외 발생")
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

## Repository Test

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

## Given-When-Then 패턴

```java
@Test
void testExample() {
    // given (준비)
    User user = User.create("John", "john@example.com");
    given(userRepository.findById(1L)).willReturn(Optional.of(user));

    // when (실행)
    UserResponse result = userService.findById(1L);

    // then (검증)
    assertThat(result.name()).isEqualTo("John");
    verify(userRepository).findById(1L);
}
```

---

## 테스트 네이밍

```java
// ✅ @DisplayName 사용 (한글 권장)
@Test
@DisplayName("사용자 생성 시 이메일 중복이면 예외 발생")
void createUserWithDuplicateEmail() { }

// ✅ 메서드명: 동사_조건_결과
@Test
void createUser_WhenEmailDuplicated_ThrowsException() { }
```

---

## 공통 규칙

```
✅ 각 테스트는 독립적으로 실행 가능
✅ 테스트 간 데이터 공유 금지
✅ 하나의 테스트, 하나의 검증
✅ 의미 있는 실패 메시지
```

```java
// ✅ 명확한 메시지
assertThat(user.getEmail())
    .as("사용자 이메일은 john@example.com이어야 함")
    .isEqualTo("john@example.com");
```

---

## 참고 자료

- [Spring Boot Testing Guide](https://spring.io/guides/gs/testing-web/)
- [Baeldung Spring Testing](https://www.baeldung.com/spring-boot-testing)
