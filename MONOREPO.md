# LearningPlatform Monorepo Guide

> Spring Boot Backend + React Frontend 모노레포 개발 가이드

---

## 프로젝트 구조

```
LearningPlatform/
├── backend/                  # Spring Boot 3.2 + Java 17-21
│   ├── src/main/java/com/example/demo/
│   │   ├── domain/           # User, Course, Enrollment
│   │   ├── global/           # Config, Exception, Common
│   │   └── security/         # JWT, Authentication
│   └── src/main/resources/   # application.yml
│
├── frontend/                 # React 19 + TypeScript 5 + Vite
│   ├── src/
│   │   ├── components/       # 공통 컴포넌트
│   │   ├── pages/            # 페이지
│   │   ├── services/         # API 서비스
│   │   ├── hooks/            # Custom Hooks
│   │   └── types/            # TypeScript 타입
│   └── vite.config.ts
│
├── conventions/              # 코딩 컨벤션 (README.md 참조)
├── docs/context/             # 도메인 상세 컨텍스트
└── CLAUDE.md                 # AI 작업 가이드
```

---

## 개발 서버 실행

```bash
# Backend (Port 8080)
cd backend && ./gradlew bootRun

# Frontend (Port 5173) - 별도 터미널
cd frontend && npm run dev
```

---

## API 통신

| 항목 | 값 |
|------|-----|
| Backend | `http://localhost:8080/api/*` |
| Frontend | `http://localhost:5173` |
| Proxy | Frontend → Backend (`/api` 자동 프록시) |

---

## 테스트

### Backend
```bash
./gradlew test                              # 전체 테스트
./gradlew test --tests "UserServiceTest"    # 특정 테스트
./gradlew jacocoTestReport                  # 커버리지
```

### Frontend
```bash
npm test                # 전체 테스트
npm test -- --coverage  # 커버리지
```

**목표 커버리지**: ≥ 80%

---

## 환경 설정

### Backend (application-dev.yml)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
  jpa:
    hibernate.ddl-auto: create-drop
  h2.console:
    enabled: true
    path: /h2-console
```

### Frontend (.env.development)
```bash
VITE_API_BASE_URL=http://localhost:8080
```

---

## 빌드 & 배포

### Backend
```bash
./gradlew bootJar
java -jar build/libs/*.jar --spring.profiles.active=prod
```

### Frontend
```bash
npm run build    # → dist/ 폴더 생성
# Vercel, Netlify, S3+CloudFront 등에 배포
```

---

## 트러블슈팅

### Port 충돌 (Windows)
```bash
netstat -ano | findstr :8080
taskkill /PID {PID} /F
```

### CORS 에러
- Backend: `CorsConfig.java`에서 `localhost:5173` 허용
- Frontend: `vite.config.ts`에서 `/api` 프록시 설정

### Build 실패
```bash
# Backend
./gradlew clean build --refresh-dependencies

# Frontend
rm -rf node_modules && npm install
```

---

## Git 전략

### Branch
- `main`: 프로덕션
- `dev`: 개발 통합
- `feat/*`: 기능 개발
- `fix/*`: 버그 수정

### Commit 형식
```
feat(backend): Add User CRUD API
fix(frontend): Resolve login state bug
test: Add UserController unit tests
```

---

## 컨벤션 참조

| 영역 | 필수 컨벤션 |
|------|------------|
| **Backend 공통** | [00-CONVENTIONS-CORE](conventions/00-CONVENTIONS-CORE.md) |
| **Frontend 공통** | [10-REACT-TYPESCRIPT-CORE](conventions/10-REACT-TYPESCRIPT-CORE.md) |
| **Backend 테스트** | [15-BACKEND-TEST](conventions/15-BACKEND-TEST-CONVENTIONS.md) |
| **Frontend 테스트** | [16-FRONTEND-TEST](conventions/16-FRONTEND-TEST-CONVENTIONS.md) |
| **Git** | [02-GIT-CONVENTIONS](conventions/02-GIT-CONVENTIONS.md) |

전체 목록: [conventions/README.md](conventions/README.md)

---

## 초기 설정 체크리스트

### Backend
- [ ] Spring Initializr로 프로젝트 생성
- [ ] Domain 패키지 구조 (user, course, enrollment)
- [ ] BaseEntity, GlobalExceptionHandler, ErrorCode
- [ ] SecurityConfig, JwtTokenProvider
- [ ] application-dev.yml, application-prod.yml

### Frontend
- [ ] Vite + React + TypeScript 생성
- [ ] 폴더 구조 (components, pages, hooks, services, types)
- [ ] Axios Instance 설정
- [ ] React Query Provider
- [ ] vite.config.ts 프록시 설정

---

**상세 가이드**: [CLAUDE.md](CLAUDE.md) | **도메인 컨텍스트**: [docs/context/](docs/context/)
