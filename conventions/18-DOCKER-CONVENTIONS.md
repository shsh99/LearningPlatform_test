# 18. Docker Conventions

> 컨테이너화 및 로컬 개발 환경 컨벤션

---

## 핵심 규칙

```
✅ 멀티스테이지 빌드 사용 → 이미지 크기 최소화
✅ .dockerignore 필수 → 불필요한 파일 제외
✅ 비root 사용자 실행 → 보안 강화
✅ 환경변수로 설정 주입 → 하드코딩 금지
✅ 헬스체크 설정 → 컨테이너 상태 모니터링
```

---

## Dockerfile 패턴

### Backend (Spring Boot)

```dockerfile
# 멀티스테이지 빌드
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 비root 사용자
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser
USER appuser

COPY --from=builder /app/build/libs/*.jar app.jar

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend (React + Nginx)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost:80 || exit 1

EXPOSE 80
```

---

## Docker Compose

### 개발 환경 (docker-compose.dev.yml)

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/learning_db
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src  # 핫리로드

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api
    volumes:
      - ./frontend/src:/app/src  # 핫리로드

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: learning_db
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
```

### 운영 환경 (docker-compose.prod.yml)

```yaml
version: '3.8'

services:
  backend:
    image: ${ECR_REGISTRY}/backend:${IMAGE_TAG}
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=${DATABASE_URL}
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M

  frontend:
    image: ${ECR_REGISTRY}/frontend:${IMAGE_TAG}
    ports:
      - "80:80"
```

---

## .dockerignore

```
# Backend
backend/build/
backend/.gradle/
backend/*.log

# Frontend
frontend/node_modules/
frontend/dist/

# Common
.git/
.env*
*.md
docker-compose*.yml
```

---

## 환경변수 관리

### .env 파일 (Git 제외)

```bash
# .env.example (커밋용 템플릿)
DB_ROOT_PASSWORD=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
```

### 컨테이너 주입

```yaml
# docker-compose.yml
services:
  backend:
    env_file:
      - .env
    environment:
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
```

---

## 명령어

```bash
# 개발 환경 실행
docker compose -f docker-compose.dev.yml up -d

# 로그 확인
docker compose logs -f backend

# 빌드 (캐시 무효화)
docker compose build --no-cache

# 정리
docker compose down -v  # 볼륨 포함 삭제
docker system prune -a  # 미사용 리소스 정리
```

---

## 체크리스트

### Dockerfile 작성 시
- [ ] 멀티스테이지 빌드 사용
- [ ] .dockerignore 설정
- [ ] 비root 사용자 설정
- [ ] HEALTHCHECK 추가
- [ ] 불필요한 레이어 최소화

### docker-compose 작성 시
- [ ] depends_on + healthcheck 조합
- [ ] 환경변수는 .env 파일로
- [ ] 볼륨 마운트 (개발용 핫리로드)
- [ ] 네트워크 분리 (필요시)

---

> 상세 인프라 구성이 필요하면 → [infrastructure.md](../docs/context/infrastructure.md)
