# Infrastructure Context

> 인프라 아키텍처 및 환경 설정 컨텍스트
> 상세 컨벤션이 필요하면 → `conventions/18~20` 참조

---

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│  Route 53 (DNS)                                              │
│  - api.example.com → ALB                                     │
│  - example.com → CloudFront                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
┌───────▼───────┐                 ┌─────────▼─────────┐
│  CloudFront   │                 │       ALB         │
│  (Frontend)   │                 │  (Backend LB)     │
└───────┬───────┘                 └─────────┬─────────┘
        │                                   │
┌───────▼───────┐                 ┌─────────▼─────────┐
│      S3       │                 │   ECS Fargate     │
│ (Static Files)│                 │   (Backend API)   │
└───────────────┘                 └─────────┬─────────┘
                                            │
                          ┌─────────────────┼─────────────────┐
                          │                 │                 │
                  ┌───────▼───────┐ ┌───────▼───────┐ ┌───────▼───────┐
                  │  RDS MySQL    │ │ ElastiCache   │ │     S3        │
                  │  (Database)   │ │ (Redis/Cache) │ │ (File Upload) │
                  └───────────────┘ └───────────────┘ └───────────────┘
```

---

## 환경 구성

| 환경 | 용도 | URL | 특징 |
|------|------|-----|------|
| **Local** | 개발 | localhost | Docker Compose |
| **Dev** | 개발 테스트 | dev.example.com | 단일 인스턴스 |
| **Staging** | QA/통합 | staging.example.com | 운영과 동일 구성 |
| **Prod** | 운영 | example.com | Multi-AZ, 오토스케일링 |

---

## AWS 리소스 매핑

### 컴퓨팅

| 서비스 | 용도 | 환경별 설정 |
|--------|------|------------|
| ECS Fargate | Backend API | dev: 1 task, prod: 2+ tasks |
| Lambda | 배치/이벤트 | 필요시 추가 |

### 데이터베이스

| 서비스 | 용도 | 환경별 설정 |
|--------|------|------------|
| RDS MySQL | 메인 DB | dev: db.t3.micro, prod: db.t3.small + Multi-AZ |
| ElastiCache | 세션/캐시 | prod만 (선택) |

### 스토리지

| 서비스 | 용도 |
|--------|------|
| S3 (frontend) | 정적 파일 호스팅 |
| S3 (uploads) | 사용자 업로드 파일 |

### 네트워킹

| 서비스 | 용도 |
|--------|------|
| Route 53 | DNS |
| CloudFront | CDN |
| ALB | 로드밸런싱 |
| VPC | 네트워크 격리 |

---

## Docker 구성

### 로컬 개발

```bash
# 전체 스택 실행
docker compose -f docker-compose.dev.yml up -d

# 서비스별 확인
docker compose ps
docker compose logs -f backend
```

### 컨테이너 구성

| 컨테이너 | 포트 | 이미지 |
|---------|------|--------|
| backend | 8080 | ./backend (빌드) |
| frontend | 3000 | ./frontend (빌드) |
| db | 3306 | mysql:8.0 |
| redis | 6379 | redis:alpine (선택) |

---

## 데이터베이스

### 연결 정보

| 환경 | Host | Port | Database |
|------|------|------|----------|
| Local | localhost | 3306 | learning_db |
| Dev | dev-db.xxx.rds.amazonaws.com | 3306 | learning_db |
| Prod | prod-db.xxx.rds.amazonaws.com | 3306 | learning_db |

### 스키마 개요

```
users
├── id (PK)
├── email (UK)
├── name, password
├── role (ADMIN/OPERATOR/INSTRUCTOR/STUDENT/USER)
├── status (ACTIVE/INACTIVE/SUSPENDED)
└── created_at, updated_at

courses
├── id (PK)
├── title, description, category
├── instructor_id (FK → users)
├── status (DRAFT/PUBLISHED/CLOSED/ARCHIVED)
└── created_at, updated_at

course_terms (강의 차수)
├── id (PK)
├── course_id (FK → courses)
├── term_number, start_date, end_date
├── capacity, enrolled_count
├── status (SCHEDULED/ONGOING/COMPLETED/CANCELLED)
└── created_at, updated_at

enrollments (수강 신청)
├── id (PK)
├── user_id (FK → users)
├── course_term_id (FK → course_terms)
├── status (PENDING/APPROVED/REJECTED/CANCELLED)
├── applied_at, processed_at
└── created_at, updated_at
```

> 상세 스키마 → [database.md](./database.md)

---

## 환경변수

### Backend

| 변수 | 설명 | 예시 |
|------|------|------|
| `SPRING_PROFILES_ACTIVE` | 프로파일 | dev/staging/prod |
| `DB_HOST` | DB 호스트 | localhost |
| `DB_PASSWORD` | DB 비밀번호 | Secrets Manager |
| `JWT_SECRET` | JWT 시크릿 | Secrets Manager |

### Frontend

| 변수 | 설명 | 예시 |
|------|------|------|
| `VITE_API_BASE_URL` | API URL | http://localhost:8080/api |
| `VITE_ENV` | 환경 | development/production |

---

## 배포 파이프라인

```
GitHub Push (main)
       ↓
GitHub Actions
       ↓
┌──────┴──────┐
│             │
▼             ▼
Backend      Frontend
Build        Build
(Gradle)     (Vite)
       ↓             ↓
Docker Build  npm build
       ↓             ↓
ECR Push     S3 Upload
       ↓             ↓
ECS Deploy   CloudFront
             Invalidation
```

---

## 모니터링

| 서비스 | 용도 |
|--------|------|
| CloudWatch Logs | 애플리케이션 로그 |
| CloudWatch Metrics | 서비스 메트릭 |
| CloudWatch Alarms | 알림 (CPU, 메모리, 에러) |
| X-Ray | 분산 추적 (선택) |

### 알림 설정

```
- ECS CPU > 80% → Slack 알림
- RDS Storage < 20% → Slack 알림
- ALB 5xx > 10/min → Slack 알림
```

---

## 비용 예상 (월간)

| 서비스 | Dev | Prod |
|--------|-----|------|
| ECS Fargate | $15 | $60 |
| RDS | 프리티어/$0 | $30 |
| S3 + CloudFront | $5 | $10 |
| ALB | $20 | $25 |
| **합계** | **~$40** | **~$125** |

---

## 관련 문서

- [18-DOCKER-CONVENTIONS](../../conventions/18-DOCKER-CONVENTIONS.md) - Docker 컨벤션
- [19-DATABASE-CONVENTIONS](../../conventions/19-DATABASE-CONVENTIONS.md) - DB 컨벤션
- [20-AWS-CONVENTIONS](../../conventions/20-AWS-CONVENTIONS.md) - AWS 컨벤션
- [database.md](./database.md) - DB 스키마 상세
