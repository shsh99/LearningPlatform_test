# 21. Security Conventions

> 보안 관련 구현 규칙 및 패턴
> **핵심**: 인증/인가, 데이터 보호, 취약점 방지

---

## 빠른 탐색

| 섹션 | 내용 |
|------|------|
| [핵심 규칙](#핵심-규칙) | 5가지 필수 보안 규칙 |
| [인증](#인증-authentication) | JWT, 비밀번호 처리 |
| [인가](#인가-authorization) | 역할 기반 접근 제어 |
| [SQL Injection](#sql-injection-방지) | JPA, 파라미터 바인딩 |
| [XSS](#xss-방지) | Backend/Frontend 방지 |
| [민감 데이터](#민감-데이터-처리) | 환경변수, 로깅 주의 |
| [입력값 검증](#입력값-검증) | Bean Validation |
| [CORS](#cors-설정) | 도메인 설정 |
| [파일 업로드](#파일-업로드-보안) | 검증 체크리스트 |

---

## 핵심 규칙

```
✅ 비밀번호 → BCrypt 해싱 (평문 저장 금지)
✅ 민감 데이터 → 환경변수 또는 Secrets Manager
✅ SQL → JPA/PreparedStatement (문자열 연결 금지)
✅ 입력값 → 서버 사이드 검증 필수
✅ JWT → HttpOnly 쿠키 또는 메모리 저장
```

---

## 인증 (Authentication)

### JWT 토큰 처리

```java
// ✅ Good: Access Token 짧게, Refresh Token 길게
public class JwtProperties {
    private long accessTokenExpiry = 15 * 60 * 1000;      // 15분
    private long refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7일
}

// ✅ Good: Refresh Token은 DB 저장하여 무효화 가능하게
@Entity
public class RefreshToken {
    @Id
    private String token;
    private Long userId;
    private LocalDateTime expiresAt;
    private boolean revoked;
}
```

### 비밀번호 처리

```java
// ✅ Good: BCrypt 사용
@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;

    public void register(String rawPassword) {
        String encoded = passwordEncoder.encode(rawPassword);
        // 저장
    }

    public boolean verify(String rawPassword, String encoded) {
        return passwordEncoder.matches(rawPassword, encoded);
    }
}

// ❌ Bad: 평문 저장, MD5/SHA1 사용
```

---

## 인가 (Authorization)

### 역할 기반 접근 제어

```java
// ✅ Good: 메서드 레벨 보안
@PreAuthorize("hasRole('ADMIN')")
public void adminOnlyMethod() { }

@PreAuthorize("hasRole('INSTRUCTOR') or #userId == authentication.principal.id")
public void instructorOrOwner(Long userId) { }

// ✅ Good: 리소스 소유권 확인
public Course getCourse(Long courseId, Long userId) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException(courseId));

    if (!course.isOwnedBy(userId) && !hasAdminRole()) {
        throw new AccessDeniedException("접근 권한이 없습니다");
    }
    return course;
}
```

---

## SQL Injection 방지

```java
// ✅ Good: JPA 사용
userRepository.findByEmail(email);

// ✅ Good: @Query with parameter binding
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);

// ❌ Bad: 문자열 연결
@Query("SELECT u FROM User u WHERE u.email = '" + email + "'")
```

---

## XSS 방지

### Backend

```java
// ✅ Good: 입력값 검증
@NotBlank
@Size(max = 100)
@Pattern(regexp = "^[가-힣a-zA-Z0-9\\s]+$")
private String title;

// ✅ Good: HTML 이스케이프 (필요시)
String safe = HtmlUtils.htmlEscape(userInput);
```

### Frontend

```tsx
// ✅ Good: React는 기본적으로 이스케이프
<div>{userInput}</div>

// ❌ Bad: dangerouslySetInnerHTML 사용 자제
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// 필요시 DOMPurify 사용
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

---

## 민감 데이터 처리

### 환경변수

```yaml
# ✅ Good: 환경변수 사용
spring:
  datasource:
    password: ${DB_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
```

```bash
# ❌ Bad: 코드에 하드코딩
# jwt.secret=my-secret-key-12345
```

### 로깅 주의

```java
// ❌ Bad: 민감 정보 로깅
log.info("User login: email={}, password={}", email, password);

// ✅ Good: 민감 정보 마스킹
log.info("User login: email={}", maskEmail(email));
```

### DTO에서 민감 정보 제외

```java
// ✅ Good: 응답에서 비밀번호 제외
public record UserResponse(
    Long id,
    String email,
    String name
    // password 없음
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getName());
    }
}
```

---

## 입력값 검증

### Backend (Bean Validation)

```java
public record CreateUserRequest(
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 형식이 아닙니다")
    String email,

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 20, message = "비밀번호는 8-20자입니다")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).*$",
             message = "비밀번호는 영문과 숫자를 포함해야 합니다")
    String password,

    @NotBlank
    @Size(max = 50)
    String name
) {}
```

### Frontend

```typescript
// ✅ Good: 클라이언트 검증 (UX용) + 서버 검증 (보안용)
const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string()
    .min(8, '8자 이상 입력하세요')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '영문과 숫자를 포함하세요'),
});
```

---

## CORS 설정

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Good: 허용 도메인 명시
        config.setAllowedOrigins(List.of(
            "https://example.com",
            "https://www.example.com"
        ));

        // ❌ Bad: 모든 도메인 허용 (운영환경)
        // config.setAllowedOrigins(List.of("*"));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowCredentials(true);

        return source;
    }
}
```

---

## 파일 업로드 보안

```java
// ✅ Good: 파일 검증
public void uploadFile(MultipartFile file) {
    // 1. 확장자 검증
    String ext = getExtension(file.getOriginalFilename());
    if (!ALLOWED_EXTENSIONS.contains(ext)) {
        throw new InvalidFileException("허용되지 않은 확장자");
    }

    // 2. MIME 타입 검증
    String contentType = file.getContentType();
    if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
        throw new InvalidFileException("허용되지 않은 파일 형식");
    }

    // 3. 파일 크기 제한
    if (file.getSize() > MAX_FILE_SIZE) {
        throw new InvalidFileException("파일 크기 초과");
    }

    // 4. 파일명 변경 (UUID)
    String savedName = UUID.randomUUID() + "." + ext;
}
```

---

## 체크리스트

### 인증/인가
- [ ] JWT 만료 시간 적절한가?
- [ ] Refresh Token 무효화 가능한가?
- [ ] 비밀번호 BCrypt 해싱?
- [ ] 리소스 소유권 확인?

### 데이터 보호
- [ ] 민감 정보 환경변수 처리?
- [ ] 로그에 민감 정보 없는가?
- [ ] 응답에 비밀번호 등 제외?

### 취약점 방지
- [ ] SQL Injection 방지 (JPA/파라미터 바인딩)?
- [ ] XSS 방지 (입력 검증, 이스케이프)?
- [ ] CORS 도메인 제한?
- [ ] 파일 업로드 검증?

---

> 상세 인증 흐름 → [architecture.md](../docs/context/architecture.md)
> JWT 구현 예시 → [04-SERVICE-CONVENTIONS.md](./04-SERVICE-CONVENTIONS.md)
