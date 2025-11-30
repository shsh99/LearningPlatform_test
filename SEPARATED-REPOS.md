# Separated Repositories Guide

> Backend / Frontend **별도 저장소** 운영 가이드

---

## 저장소 구조

```
learning-platform-backend/    # Backend 전용
├── src/main/java/.../
├── build.gradle
└── CLAUDE.md

learning-platform-frontend/   # Frontend 전용
├── src/
├── vite.config.ts
└── CLAUDE.md
```

---

## API 통신 설정

### 개발 환경
| 항목 | Backend | Frontend |
|------|---------|----------|
| Port | 8080 | 3000 |
| URL | `localhost:8080/api` | `localhost:3000` |

### Frontend 환경변수
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api

# .env.production
VITE_API_BASE_URL=https://api.example.com/api
```

### Backend CORS
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");  // 개발
        config.addAllowedOrigin("https://example.com");    // 운영
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

---

## 개발 서버 실행

```bash
# Terminal 1: Backend
cd learning-platform-backend && ./gradlew bootRun

# Terminal 2: Frontend
cd learning-platform-frontend && npm run dev
```

---

## 배포

```
Backend:  GitHub Actions → AWS EC2/ECS → api.example.com
Frontend: GitHub Actions → Vercel/Netlify → example.com
```

---

## Git 전략

각 저장소 독립 관리:
```
backend:  main → dev → feat/user-api
frontend: main → dev → feat/login-page
```

### 버전 관리
```bash
# 독립 버전
backend: v1.2.0 / frontend: v1.3.0

# 동기화 버전 (릴리스 맞춤)
backend: v2024.01.15 / frontend: v2024.01.15
```

---

## 문서 공유 방법

| 방법 | 설명 |
|------|------|
| **별도 저장소** | `learning-platform-docs/` 공유 문서 저장소 |
| **복사** | 각 저장소에 필요한 컨벤션만 복사 |
| **Submodule** | `git submodule add <docs-repo> docs` |

---

## 트러블슈팅

### CORS 에러
```
1. Backend CorsConfig에서 Frontend Origin 허용 확인
2. allowCredentials(true) 설정
3. Frontend axios에 withCredentials: true
```

### API 연결 실패
```
1. Backend 서버 실행 확인 (localhost:8080)
2. .env의 VITE_API_BASE_URL 확인
3. 네트워크 탭에서 요청 URL 확인
```

---

## 모노레포 vs 분리형

| 항목 | 모노레포 | 분리형 |
|------|---------|--------|
| 저장소 | 1개 | 2개+ |
| 배포 | 동시/개별 | 완전 독립 |
| 팀 구조 | 풀스택 | 프론트/백 분리 |
| 코드 공유 | 쉬움 | 별도 패키지 |

**분리형 선택 시**: 팀 분리, 독립 배포 주기, 저장소 권한 분리 필요

---

> 모노레포가 필요하면 → [MONOREPO.md](./MONOREPO.md)
