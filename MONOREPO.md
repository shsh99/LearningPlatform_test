# LearningPlatform Monorepo Guide

**목적**: Spring Boot Backend + React Frontend 모노레포 개발 가이드

---

## 📁 프로젝트 구조

```
LearningPlatform/
├── backend/                        # Spring Boot 3.2 + Java 17-21
│   ├── src/main/java/
│   │   └── com/learningplatform/
│   │       ├── domain/             # User, Course, Enrollment 등
│   │       ├── common/             # BaseEntity, ErrorCode, GlobalExceptionHandler
│   │       ├── config/             # SecurityConfig, JpaConfig
│   │       └── security/           # JWT, Authentication
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   └── application-prod.yml
│   ├── src/test/java/
│   ├── build.gradle
│   └── CLAUDE.md                   # Backend 전용 가이드
│
├── frontend/                       # React 19 + TypeScript 5 + Vite
│   ├── src/
│   │   ├── components/             # Button, Input, Modal 등
│   │   ├── pages/                  # LoginPage, CoursePage 등
│   │   ├── hooks/                  # useAuth, useCourses 등
│   │   ├── services/               # authService, courseService
│   │   ├── store/                  # Zustand stores
│   │   ├── types/                  # TypeScript 타입 정의
│   │   └── utils/                  # errorHandler, dateFormatter
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── CLAUDE.md                   # Frontend 전용 가이드
│
├── conventions/                    # 📚 공유 코딩 컨벤션
│   ├── 00-CONVENTIONS-CORE.md      # Backend 핵심 규칙
│   ├── 01-PROJECT-STRUCTURE.md     # Backend 구조
│   ├── 03-08-*.md                  # Backend 레이어별
│   ├── 10-REACT-TYPESCRIPT-CORE.md # Frontend 핵심 규칙
│   ├── 11-14-*.md                  # Frontend 상세
│   ├── 15-TEST-CONVENTIONS.md      # 테스트 규칙
│   ├── 02-GIT-CONVENTIONS.md       # Git 규칙
│   └── README.md                   # 컨벤션 목차
│
├── docs/                           # (선택) 프로젝트 문서
│   └── api/                        # API 명세서
│
├── .gitignore
├── MONOREPO.md                     # 이 파일
└── README.md                       # 프로젝트 소개
```

---

## 🏗️ 아키텍처 & 통신

### API 통신 규칙

```
✅ Backend REST API: http://localhost:8080/api/*
✅ Frontend Dev Server: http://localhost:3000
✅ Proxy: Frontend → Backend (/api 요청 자동 프록시)
✅ CORS: Backend에서 http://localhost:3000 허용
```

### 배포 독립성

```
✅ Backend: JAR 파일로 독립 배포 가능
✅ Frontend: 정적 파일(dist/)로 독립 배포 가능
✅ 각 프로젝트는 독립적으로 실행 가능
```

---

## 🚀 개발 워크플로우

### 1. 초기 설정

```bash
# Backend 설정
cd backend
./gradlew build

# Frontend 설정
cd frontend
npm install
```

### 2. 개발 서버 실행

```bash
# Backend (Port 8080)
cd backend
./gradlew bootRun

# Frontend (Port 3000) - 별도 터미널
cd frontend
npm run dev
```

### 3. 동시 실행 (선택)

```bash
# Root package.json에 다음 스크립트 추가 가능
npm run dev:all     # Backend + Frontend 동시 실행
npm run dev:backend # Backend만
npm run dev:frontend # Frontend만
```

---

## 🧪 테스트 전략

### Backend (JUnit5 + MockMvc)

```bash
# 전체 테스트
./gradlew test

# 특정 테스트
./gradlew test --tests "UserServiceTest"

# 커버리지 리포트 (JaCoCo)
./gradlew jacocoTestReport
# → build/reports/jacoco/test/html/index.html
```

**테스트 구조**:
```
✅ Unit: @ExtendWith(MockitoExtension.class)
✅ Controller: @WebMvcTest(UserController.class)
✅ Repository: @DataJpaTest
✅ Integration: @SpringBootTest
✅ 패턴: Given-When-Then
```

**참고 컨벤션**: [conventions/15-TEST-CONVENTIONS.md](conventions/15-TEST-CONVENTIONS.md)

---

### Frontend (Vitest + React Testing Library)

```bash
# 전체 테스트
npm test

# Watch 모드
npm test -- --watch

# 커버리지
npm test -- --coverage
# → coverage/index.html
```

**테스트 구조**:
```
✅ Component: React Testing Library
✅ Hook: renderHook()
✅ API Mock: MSW (Mock Service Worker)
✅ E2E: Playwright (critical flows)
✅ 패턴: Arrange-Act-Assert
```

**참고 컨벤션**: [conventions/15-TEST-CONVENTIONS.md](conventions/15-TEST-CONVENTIONS.md)

---

### 커버리지 목표

```
Backend: ≥ 80% (JaCoCo)
Frontend: ≥ 80% (Vitest)
```

---

## 📋 코딩 컨벤션

### Backend 작업 시 참조

| 작업 | 참조 컨벤션 |
|------|------------|
| **공통** | [00-CONVENTIONS-CORE.md](conventions/00-CONVENTIONS-CORE.md) |
| **프로젝트 구조** | [01-PROJECT-STRUCTURE.md](conventions/01-PROJECT-STRUCTURE.md) |
| **Controller** | [03-CONTROLLER-CONVENTIONS.md](conventions/03-CONTROLLER-CONVENTIONS.md) |
| **Service** | [04-SERVICE-CONVENTIONS.md](conventions/04-SERVICE-CONVENTIONS.md) |
| **Repository** | [05-REPOSITORY-CONVENTIONS.md](conventions/05-REPOSITORY-CONVENTIONS.md) |
| **Entity** | [06-ENTITY-CONVENTIONS.md](conventions/06-ENTITY-CONVENTIONS.md) |
| **DTO** | [07-DTO-CONVENTIONS.md](conventions/07-DTO-CONVENTIONS.md) |
| **Exception** | [08-EXCEPTION-CONVENTIONS.md](conventions/08-EXCEPTION-CONVENTIONS.md) |
| **Test** | [15-TEST-CONVENTIONS.md](conventions/15-TEST-CONVENTIONS.md) |

---

### Frontend 작업 시 참조

| 작업 | 참조 컨벤션 |
|------|------------|
| **공통** | [10-REACT-TYPESCRIPT-CORE.md](conventions/10-REACT-TYPESCRIPT-CORE.md) |
| **프로젝트 구조** | [11-REACT-PROJECT-STRUCTURE.md](conventions/11-REACT-PROJECT-STRUCTURE.md) |
| **Component** | [12-REACT-COMPONENT-CONVENTIONS.md](conventions/12-REACT-COMPONENT-CONVENTIONS.md) |
| **State Management** | [13-REACT-STATE-MANAGEMENT.md](conventions/13-REACT-STATE-MANAGEMENT.md) |
| **API Integration** | [14-REACT-API-INTEGRATION.md](conventions/14-REACT-API-INTEGRATION.md) |
| **Test** | [15-TEST-CONVENTIONS.md](conventions/15-TEST-CONVENTIONS.md) |

---

### Git 작업 시 참조

| 작업 | 참조 컨벤션 |
|------|------------|
| **Commit/PR** | [02-GIT-CONVENTIONS.md](conventions/02-GIT-CONVENTIONS.md) |
| **Submodule** | [09-GIT-SUBMODULE-CONVENTIONS.md](conventions/09-GIT-SUBMODULE-CONVENTIONS.md) |

---

## 🔧 환경 설정

### Backend (application.yml)

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
      path: /h2-console

# application-prod.yml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
```

**H2 Console**: http://localhost:8080/h2-console (개발 환경)

---

### Frontend (.env)

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_MOCK=false

# .env.production
VITE_API_BASE_URL=https://api.learningplatform.com
VITE_ENABLE_MOCK=false
```

**주의**: `.env.local`은 `.gitignore`에 포함

---

## 🔐 보안 가이드라인

### Backend

```
✅ Input Validation: @Valid, @NotNull, @Email 등
✅ SQL Injection 방지: JPA Parameterized Query
✅ CSRF 보호: Spring Security 기본 활성화
✅ Authentication: JWT 기반 인증
✅ Authorization: @PreAuthorize, Role 기반 권한
```

**참고**: [conventions/00-CONVENTIONS-CORE.md](conventions/00-CONVENTIONS-CORE.md)

---

### Frontend

```
✅ XSS 방지: React 기본 이스케이핑 + DOMPurify (HTML 렌더링 시)
✅ CSRF 토큰: Axios Interceptor에서 자동 첨부
✅ 민감 정보: 환경변수 사용, 코드에 하드코딩 금지
✅ API 인증: Authorization: Bearer {token}
```

**참고**: [conventions/10-REACT-TYPESCRIPT-CORE.md](conventions/10-REACT-TYPESCRIPT-CORE.md)

---

## ⚡ 성능 목표

### Backend

```
✅ CRUD API 응답 시간: < 200ms
✅ N+1 쿼리 방지: Fetch Join, EntityGraph 사용
✅ Connection Pool: HikariCP (기본값)
✅ Index: 자주 조회하는 컬럼에 @Index
```

**참고**: [conventions/05-REPOSITORY-CONVENTIONS.md](conventions/05-REPOSITORY-CONVENTIONS.md)

---

### Frontend

```
✅ Initial Load: < 3s (3G 네트워크)
✅ Initial Bundle: < 500KB
✅ Code Splitting: React.lazy() + Suspense
✅ Image Optimization: WebP, Lazy Loading
✅ API 캐싱: React Query (5분 staleTime)
```

**참고**: [conventions/11-REACT-PROJECT-STRUCTURE.md](conventions/11-REACT-PROJECT-STRUCTURE.md)

---

## 🐛 트러블슈팅

### Port 충돌

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID {PID} /F

netstat -ano | findstr :3000
taskkill /PID {PID} /F
```

---

### CORS 에러

**Backend (CorsConfig.java)**:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .allowCredentials(true);
    }
}
```

**Frontend (vite.config.ts)**:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

---

### Database 연결 실패

```bash
# H2 Console 확인: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:testdb
# Username: sa
# Password: (비어있음)
```

---

### Build 실패

```bash
# Backend
cd backend
./gradlew clean build --refresh-dependencies

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🚢 배포

### Backend (JAR)

```bash
# Build
cd backend
./gradlew bootJar

# Run
java -jar backend/build/libs/learningplatform.jar \
  --spring.profiles.active=prod \
  --spring.datasource.url=${DB_URL}
```

---

### Frontend (Static Files)

```bash
# Build
cd frontend
npm run build

# Output: frontend/dist/
# Deploy to: Vercel, Netlify, AWS S3 + CloudFront
```

---

### Docker (Optional)

```dockerfile
# backend/Dockerfile
FROM eclipse-temurin:17-jre
COPY build/libs/learningplatform.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

# frontend/Dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## 📝 Git 브랜치 전략

```
main          → Production (배포용)
develop       → Integration (개발 통합)
feature/*     → 새 기능 개발
fix/*         → 버그 수정
hotfix/*      → 긴급 수정 (main → main + develop)
```

### 커밋 메시지 규칙

```
feat(backend): Add User CRUD API
feat(frontend): Implement Login page
fix(backend): Resolve N+1 query in CourseService
fix(frontend): Fix button disabled state
test(backend): Add UserService unit tests
docs: Update API specification
chore: Update dependencies
```

**참고**: [conventions/02-GIT-CONVENTIONS.md](conventions/02-GIT-CONVENTIONS.md)

---

### PR 요구사항

```
✅ 모든 테스트 통과
✅ Linter 통과 (Checkstyle, ESLint)
✅ 커버리지 ≥ 80%
✅ CHANGELOG.md 업데이트 (Breaking Changes 시)
✅ 최소 1명 리뷰 승인
```

---

## 📚 베스트 프랙티스

### 코드 품질

```
✅ DRY (Don't Repeat Yourself)
✅ SOLID 원칙
✅ Component Composition (React)
✅ Separation of Concerns
```

---

### 에러 처리

```
✅ Backend: ErrorCode Enum + GlobalExceptionHandler
✅ Frontend: AxiosError 처리 + toast/alert
✅ 일관된 에러 응답 형식
```

**참고**: [conventions/08-EXCEPTION-CONVENTIONS.md](conventions/08-EXCEPTION-CONVENTIONS.md)

---

### 로깅

```
✅ Backend: SLF4J + Logback
✅ Frontend: console.error() (개발), Sentry (프로덕션)
✅ 민감 정보 로그 금지 (비밀번호, 토큰 등)
```

---

## 🎯 프로젝트 초기 설정 체크리스트

### Backend

- [ ] `backend/` 폴더 생성
- [ ] Spring Initializr로 프로젝트 생성 (Spring Boot 3.2, Java 17)
- [ ] Domain 패키지 구조 생성 (user, course, enrollment)
- [ ] BaseEntity, BaseTimeEntity 작성
- [ ] GlobalExceptionHandler, ErrorCode 작성
- [ ] SecurityConfig, JwtTokenProvider 작성
- [ ] application-dev.yml, application-prod.yml 작성
- [ ] H2 Console 설정

**참고**: [conventions/01-PROJECT-STRUCTURE.md](conventions/01-PROJECT-STRUCTURE.md)

---

### Frontend

- [ ] `frontend/` 폴더 생성
- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] 폴더 구조 생성 (components, pages, hooks, services, types)
- [ ] Axios Instance 설정 (axiosInstance.ts)
- [ ] React Query Provider 설정 (main.tsx)
- [ ] tsconfig.json 절대 경로 설정 (`@/`)
- [ ] vite.config.ts Proxy 설정
- [ ] .env.development, .env.production 작성

**참고**: [conventions/11-REACT-PROJECT-STRUCTURE.md](conventions/11-REACT-PROJECT-STRUCTURE.md)

---

### Git

- [ ] `.gitignore` 설정 (backend/build, frontend/dist, node_modules, .env.local)
- [ ] README.md 작성
- [ ] 브랜치 전략 팀 공유 (main, develop, feature/*)
- [ ] 커밋 메시지 규칙 공유

**참고**: [conventions/02-GIT-CONVENTIONS.md](conventions/02-GIT-CONVENTIONS.md)

---

## 📖 참고 자료

**Backend**:
- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/)

**Frontend**:
- [Airbnb React/JSX Guide](https://airbnb.io/javascript/react/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

**Testing**:
- [Spring Boot Testing Guide](https://spring.io/guides/gs/testing-web/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
