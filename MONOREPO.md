# LearningPlatform Monorepo Guide

> 환경 설정, 실행, 배포 가이드
> **프로젝트 구조 → [CLAUDE.md](CLAUDE.md) | Git 전략 → [02-GIT-CONVENTIONS](conventions/02-GIT-CONVENTIONS.md)**

---

## 개발 서버 실행

```bash
# Backend (Port 8080)
cd backend && ./gradlew bootRun

# Frontend (Port 3000) - 별도 터미널
cd frontend && npm run dev
```

| 항목 | 값 |
|------|-----|
| Backend | `http://localhost:8080/api/*` |
| Frontend | `http://localhost:3000` |
| Proxy | Frontend → Backend (`/api` 자동 프록시) |

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
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 테스트

```bash
# Backend
./gradlew test                              # 전체 테스트
./gradlew test --tests "UserServiceTest"    # 특정 테스트
./gradlew jacocoTestReport                  # 커버리지

# Frontend
npm test                # 전체 테스트
npm test -- --coverage  # 커버리지
```

**목표 커버리지**: ≥ 80%

---

## 빌드 & 배포

```bash
# Backend
./gradlew bootJar
java -jar build/libs/*.jar --spring.profiles.active=prod

# Frontend
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
- Backend: `CorsConfig.java`에서 `localhost:3000` 허용
- Frontend: `vite.config.ts`에서 `/api` 프록시 설정

### Build 실패
```bash
# Backend
./gradlew clean build --refresh-dependencies

# Frontend
rm -rf node_modules && npm install
```

---

## 초기 설정 체크리스트

### Backend
- [ ] Domain 패키지 구조 (user, course, enrollment)
- [ ] BaseEntity, GlobalExceptionHandler, ErrorCode
- [ ] SecurityConfig, JwtTokenProvider
- [ ] application-dev.yml, application-prod.yml

### Frontend
- [ ] 폴더 구조 (components, pages, hooks, services, types)
- [ ] Axios Instance + React Query Provider
- [ ] vite.config.ts 프록시 설정

---

> **상세 가이드**: [CLAUDE.md](CLAUDE.md) | **컨벤션**: [conventions/README.md](conventions/README.md)
