# 로그아웃 시 토큰 미삭제 문제

**날짜**: 2025-11-20 | **상태**: ✅ 해결 | **소요**: 45분

---

## 🔴 문제

> "로그아웃을 해도 토큰이 삭제되지 않아 해결해봐"

- 로그아웃 후에도 동일 토큰으로 API 접근 가능
- 보안 위험: 탈취된 토큰 계속 유효

---

## 📂 문제 파일

### AuthController.java
```java
// ❌ BEFORE
@PostMapping("/logout")
public ResponseEntity<Void> logout() {
    log.info("User logged out");
    return ResponseEntity.ok().build();  // 토큰 무효화 없음
}
```

### JwtAuthenticationFilter.java
```java
// ❌ BEFORE
if (token != null && jwtTokenProvider.validateToken(token)) {
    // 블랙리스트 체크 없음
}
```

---

## 🔍 원인

JWT는 Stateless → 서버에서 직접 무효화 불가능
→ **블랙리스트 방식 필요**

---

## ✅ 해결

### 1. TokenBlacklistService 생성
```java
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final RedisTemplate<String, String> redisTemplate;

    public void addToBlacklist(String token) {
        long ttl = jwtTokenProvider.getExpirationTime(token);
        redisTemplate.opsForValue().set(
            "blacklist:" + token, "true", ttl, TimeUnit.MILLISECONDS);
    }

    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);
    }
}
```

### 2. AuthController 수정
```java
// ✅ AFTER
@PostMapping("/logout")
public ResponseEntity<Void> logout(@RequestHeader("Authorization") String auth) {
    String token = auth.replace("Bearer ", "");
    tokenBlacklistService.addToBlacklist(token);
    return ResponseEntity.ok().build();
}
```

### 3. JwtAuthenticationFilter 수정
```java
// ✅ AFTER
if (token != null
    && !tokenBlacklistService.isBlacklisted(token)  // 추가
    && jwtTokenProvider.validateToken(token)) {
    // ...
}
```

---

## 📝 변경 파일

**새로 생성**:
- `TokenBlacklistService.java`
- `RedisConfig.java`

**수정**:
- `AuthController.java` - 로그아웃 로직
- `JwtAuthenticationFilter.java` - 블랙리스트 체크
- `JwtTokenProvider.java` - getExpirationTime() 추가
- `build.gradle` - Redis 의존성
- `application.yml` - Redis 설정

---

## 🧪 테스트

```bash
# 1. 로그인 → 토큰 발급
# 2. 토큰으로 API 접근 → 200 OK
# 3. 로그아웃
# 4. 동일 토큰으로 API 접근 → 401 Unauthorized ✅
```

---

## 💡 배운 점

- JWT Stateless 특성 → 블랙리스트 필요
- Redis TTL로 자동 만료 처리
- 블랙리스트 조회 실패 시 접근 차단 (안전)
