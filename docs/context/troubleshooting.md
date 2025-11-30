# Troubleshooting Guide

> 자주 발생하는 문제와 해결 방법
> **AI가 에러 발생 시 참조하는 문서**

---

## 언제 이 문서를 참조하나요?

| 상황 | 참조 섹션 |
|------|----------|
| 빌드 실패 | Backend/Frontend 빌드 에러 |
| 서버 실행 안됨 | 환경 설정 문제 |
| DB 연결 실패 | 데이터베이스 문제 |
| API 호출 실패 | CORS, 인증 문제 |
| 테스트 실패 | 테스트 관련 문제 |

---

## Backend 문제

### 빌드 에러

#### Gradle 빌드 실패
```
문제: Could not resolve dependency
해결:
1. ./gradlew clean build --refresh-dependencies
2. ~/.gradle/caches 삭제 후 재빌드
3. build.gradle 의존성 버전 확인
```

#### Java 버전 불일치
```
문제: Unsupported class file major version
해결:
1. JAVA_HOME 확인: echo $JAVA_HOME
2. Java 17-21 사용 확인
3. build.gradle의 sourceCompatibility 확인
```

### 서버 실행 에러

#### 포트 충돌
```
문제: Port 8080 already in use
해결:
- Mac/Linux: lsof -i :8080 | kill -9 [PID]
- Windows: netstat -ano | findstr :8080 → taskkill /PID [PID] /F
- 또는 application.yml에서 server.port 변경
```

#### Bean 생성 실패
```
문제: Error creating bean with name 'xxxService'
해결:
1. @Service, @Repository 어노테이션 확인
2. 생성자 주입 파라미터 확인
3. 순환 참조 확인 (A → B → A)
4. @RequiredArgsConstructor 누락 확인
```

### 데이터베이스 문제

#### H2 연결 실패 (개발환경)
```
문제: Database not found
해결:
1. application-dev.yml 확인:
   spring.datasource.url: jdbc:h2:mem:testdb
2. H2 Console 활성화 확인:
   spring.h2.console.enabled: true
```

#### MySQL 연결 실패 (운영환경)
```
문제: Access denied for user
해결:
1. 환경변수 확인: echo $DB_PASSWORD
2. MySQL 사용자 권한 확인
3. 방화벽/보안그룹 확인 (3306 포트)
```

#### JPA 스키마 에러
```
문제: Table 'xxx' doesn't exist
해결:
1. ddl-auto 설정 확인: create, update, validate
2. Entity 클래스 @Table 이름 확인
3. Flyway 마이그레이션 실행 여부 확인
```

### N+1 쿼리 문제
```
문제: 대량 조회 시 성능 저하
해결:
1. @EntityGraph 사용
2. Fetch Join 쿼리 작성
3. BatchSize 설정

예시:
@Query("SELECT c FROM Course c JOIN FETCH c.instructor WHERE c.id = :id")
Optional<Course> findByIdWithInstructor(@Param("id") Long id);
```

---

## Frontend 문제

### 빌드 에러

#### npm install 실패
```
문제: ERESOLVE unable to resolve dependency tree
해결:
1. rm -rf node_modules package-lock.json
2. npm cache clean --force
3. npm install
```

#### TypeScript 에러
```
문제: Type 'xxx' is not assignable to type 'yyy'
해결:
1. 타입 정의 확인 (types/ 폴더)
2. API 응답 타입과 일치하는지 확인
3. as unknown as Type 임시 우회 (비권장)
```

### 런타임 에러

#### 환경변수 못 읽음
```
문제: import.meta.env.VITE_XXX is undefined
해결:
1. .env 파일 위치 확인 (프로젝트 루트)
2. 변수명 VITE_ 접두사 확인
3. 서버 재시작 (env 변경 시 필수)
```

#### React Query 에러
```
문제: No QueryClient set
해결:
1. QueryClientProvider로 App 감싸기
2. queryClient 인스턴스 생성 확인

const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

## API 연동 문제

### CORS 에러
```
문제: Access-Control-Allow-Origin 에러
해결:
Backend CorsConfig 확인:
- allowedOrigins에 Frontend URL 추가
- allowCredentials 설정 확인
- 개발환경: http://localhost:3000
```

### 인증 에러

#### 401 Unauthorized
```
문제: JWT 토큰 없음/만료
해결:
1. localStorage/쿠키에 토큰 존재 확인
2. Authorization 헤더 형식: Bearer {token}
3. 토큰 만료 시 refresh 로직 확인
```

#### 403 Forbidden
```
문제: 권한 부족
해결:
1. 사용자 Role 확인 (STUDENT/INSTRUCTOR/ADMIN)
2. @PreAuthorize 조건 확인
3. 리소스 소유권 확인
```

### 네트워크 에러
```
문제: Network Error / ERR_CONNECTION_REFUSED
해결:
1. Backend 서버 실행 중인지 확인
2. API URL 확인 (포트, 경로)
3. 프록시 설정 확인 (vite.config.ts)
```

---

## Docker 문제

### 컨테이너 시작 실패
```
문제: Container exited with code 1
해결:
1. docker logs [container_name]
2. 환경변수 확인
3. 포트 매핑 충돌 확인
```

### 이미지 빌드 실패
```
문제: COPY failed: file not found
해결:
1. .dockerignore 확인
2. 빌드 컨텍스트 경로 확인
3. 멀티스테이지 빌드 시 이전 스테이지 확인
```

---

## 테스트 문제

### Backend 테스트 실패
```
문제: @SpringBootTest 로딩 실패
해결:
1. @ActiveProfiles("test") 추가
2. application-test.yml 확인
3. @MockBean으로 외부 의존성 모킹
```

### Frontend 테스트 실패
```
문제: Cannot find module '@/xxx'
해결:
1. vitest.config.ts alias 설정 확인
2. tsconfig.json paths 설정 확인
```

---

## 빠른 해결 체크리스트

### 빌드가 안될 때
- [ ] 캐시 삭제 (node_modules, .gradle)
- [ ] 의존성 재설치
- [ ] 환경변수 확인
- [ ] Java/Node 버전 확인

### 서버가 안뜰 때
- [ ] 포트 충돌 확인
- [ ] DB 연결 확인
- [ ] 로그 확인 (에러 메시지)
- [ ] 환경 프로필 확인

### API가 안될 때
- [ ] Backend 서버 실행 확인
- [ ] CORS 설정 확인
- [ ] 인증 토큰 확인
- [ ] 네트워크 탭에서 요청/응답 확인

---

## 도움 요청 시 제공할 정보

```markdown
## 환경
- OS:
- Java/Node 버전:
- 브라우저:

## 에러 메시지
(전체 에러 메시지 복사)

## 재현 단계
1.
2.
3.

## 시도한 해결 방법
-
```

---

> 상세 환경 설정 → [MONOREPO.md](../../MONOREPO.md)
> 인프라 문제 → [infrastructure.md](./infrastructure.md)
