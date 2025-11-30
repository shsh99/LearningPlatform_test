# 23. External API Integration Conventions

> 외부 서비스 연동 규칙
> **핵심**: 추상화, 타임아웃, 재시도, 에러 처리

---

## 핵심 규칙

```
✅ 인터페이스로 추상화 (테스트 용이)
✅ 타임아웃 필수 (무한 대기 방지)
✅ 재시도는 멱등성 보장 요청만
✅ 에러 → 비즈니스 예외로 변환
✅ 비밀키 → 환경변수 관리
```

---

## 클라이언트 구조

### 인터페이스 추상화

```java
// 인터페이스 (테스트 시 Mock 가능)
public interface PaymentClient {
    PaymentResult process(PaymentRequest request);
}

// 실제 구현
@Component
@RequiredArgsConstructor
public class TossPaymentClient implements PaymentClient {
    private final RestTemplate restTemplate;

    @Override
    public PaymentResult process(PaymentRequest request) {
        // Toss API 호출
    }
}
```

### 패키지 구조
```
domain/payment/
├── client/
│   ├── PaymentClient.java          # 인터페이스
│   └── TossPaymentClient.java      # 구현체
├── dto/
└── exception/
```

---

## RestTemplate 설정

```java
@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }
}
```

---

## 재시도 로직

```java
@EnableRetry
@Configuration
public class RetryConfig { }

@Service
public class ExternalApiService {
    @Retryable(
        retryFor = { SocketTimeoutException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public ApiResponse callExternalApi(ApiRequest request) {
        return externalClient.call(request);
    }

    @Recover
    public ApiResponse recover(Exception e, ApiRequest request) {
        throw new ExternalApiException("외부 API 호출 실패", e);
    }
}
```

### 재시도 기준
```
✅ 재시도 OK: 타임아웃, 5xx 서버 에러, 멱등성 GET 요청
❌ 재시도 NO: 4xx 클라이언트 에러, 결제 등 중복 위험 요청
```

---

## 에러 처리

```java
public class ExternalApiException extends RuntimeException {
    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
    }
}

// 세분화
public class ExternalApiAuthException extends ExternalApiException { }
public class ExternalApiRateLimitException extends ExternalApiException { }
```

---

## 인증 정보 관리

```yaml
# application.yml
external:
  payment:
    base-url: ${PAYMENT_API_URL}
    api-key: ${PAYMENT_API_KEY}
```

```java
@ConfigurationProperties(prefix = "external.payment")
public record PaymentApiProperties(
    @NotBlank String baseUrl,
    @NotBlank String apiKey
) { }
```

---

## 로깅

```java
@Slf4j
@Component
public class ExternalApiLoggingInterceptor implements ClientHttpRequestInterceptor {
    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body,
            ClientHttpRequestExecution execution) throws IOException {
        long start = System.currentTimeMillis();
        log.info("External API: {} {}", request.getMethod(), request.getURI());

        ClientHttpResponse response = execution.execute(request, body);

        log.info("Response: {} ({}ms)", response.getStatusCode(),
            System.currentTimeMillis() - start);
        return response;
    }
}
```

---

## 서킷 브레이커 (선택)

```java
@CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
public ApiResponse callExternalApi(ApiRequest request) {
    return externalClient.call(request);
}

public ApiResponse fallback(ApiRequest request, Exception e) {
    return ApiResponse.empty();
}
```

---

## 체크리스트

- [ ] 인터페이스로 추상화
- [ ] 타임아웃 설정 (connect: 5s, read: 10s)
- [ ] 재시도 로직 (필요시)
- [ ] API Key 환경변수 관리
- [ ] 요청/응답 로깅

---

## 일반적인 외부 API

| 서비스 | 용도 | 주의사항 |
|--------|------|----------|
| 결제 (Toss) | 결제 처리 | 멱등키 필수 |
| 소셜 로그인 | OAuth 인증 | 토큰 만료 처리 |
| FCM/슬랙 | 알림 | Rate Limit |
| S3 | 파일 저장 | 대용량 처리 |

---

> 보안 → [21-SECURITY-CONVENTIONS.md](./21-SECURITY-CONVENTIONS.md)
