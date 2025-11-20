# 09. Git Submodule Conventions

> 📌 **먼저 읽기**: [02-GIT-CONVENTIONS.md](./02-GIT-CONVENTIONS.md)

**목적**: Git Submodule을 활용한 민감 정보 안전 관리

---

## 1. Git Submodule이란?

Private Git 저장소를 활용해 민감한 설정 파일을 별도로 관리하는 방법

### 적합한 환경
- ✅ 개발/로컬 환경
- ✅ 소규모 팀 협업
- ✅ 설정 파일 버전 관리 필요
- ❌ 프로덕션 환경 (AWS Secrets Manager/Vault 권장)

---

## 2. 프로젝트 구조

```
your-project/
├── src/
│   └── main/
│       └── resources/
│           ├── application.yml          (커밋 O, 환경변수 참조)
│           └── config/                  (Submodule, 커밋 X)
│               ├── application-dev.yml
│               ├── application-local.yml
│               └── application-prod.yml
├── .gitignore
└── .gitmodules                          (자동 생성)
```

---

## 3. Submodule 설정 (최초 1회)

### Step 1: Private 저장소 생성

GitHub에서 Private Repository 생성:
```
저장소명: your-project-config (예시)
Public/Private: Private ✅
```

### Step 2: 설정 파일 업로드

```bash
# config 저장소 클론
git clone https://github.com/your-org/your-project-config.git
cd your-project-config

# 설정 파일 작성
cat > application-dev.yml <<EOF
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db
    username: dev_user
    password: dev_password_123
jwt:
  secret: dev_jwt_secret_key_12345
aws:
  access-key: AKIAIOSFODNN7EXAMPLE_DEV
  secret-key: wJalrXUtnFEMI/K7MDENG/DEV_SECRET
EOF

# 커밋 & 푸시
git add .
git commit -m "[Init] 개발 환경 설정"
git push origin main
```

### Step 3: 메인 프로젝트에 Submodule 추가

```bash
# 메인 프로젝트 디렉토리에서
cd your-project

# submodule 추가
git submodule add https://github.com/your-org/your-project-config.git src/main/resources/config

# .gitignore에 추가 (중요!)
echo "src/main/resources/config/" >> .gitignore

# 커밋
git add .
git commit -m "[Chore] Submodule 설정 추가"
git push
```

---

## 4. 팀원 초기 설정

### 메인 프로젝트 클론 후

```bash
# 1. 프로젝트 클론
git clone https://github.com/your-org/your-project.git
cd your-project

# 2. Submodule 초기화 & 다운로드
git submodule init
git submodule update

# 또는 한 번에
git submodule update --init --recursive
```

### 클론 시 Submodule 함께 받기

```bash
# 한 번에 클론 + submodule
git clone --recurse-submodules https://github.com/your-org/your-project.git
```

---

## 5. 일상적인 작업

### Submodule 최신화

```bash
# 메인 프로젝트에서 실행
git submodule update --remote

# 또는 config 폴더에서 직접 pull
cd src/main/resources/config
git pull origin main
cd ../../../..
```

### Submodule 설정 수정

```bash
# 1. config 폴더로 이동
cd src/main/resources/config

# 2. 브랜치 확인 (detached HEAD 상태일 수 있음)
git checkout main
git pull

# 3. 수정
vim application-dev.yml

# 4. 커밋 & 푸시
git add .
git commit -m "[Fix] DB 비밀번호 변경"
git push origin main

# 5. 메인 프로젝트로 돌아가서 submodule 참조 업데이트
cd ../../../..
git add src/main/resources/config
git commit -m "[Chore] Config submodule 업데이트"
git push
```

---

## 6. Spring Boot 통합

### application.yml (메인, 커밋 O)

```yaml
spring:
  profiles:
    active: local  # 기본 프로파일
  config:
    import:
      - classpath:config/application-${spring.profiles.active}.yml

# 또는 환경변수 참조 방식
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

### application-local.yml (Submodule, 커밋 X)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: local_password_123

jwt:
  secret: local_jwt_secret_key_abc123
  expiration: 3600000
```

### 실행 시 프로파일 지정

```bash
# local 환경
./gradlew bootRun --args='--spring.profiles.active=local'

# dev 환경
./gradlew bootRun --args='--spring.profiles.active=dev'
```

---

## 7. .gitignore 필수 설정

```gitignore
# Submodule 디렉토리 (민감 정보!)
src/main/resources/config/

# .env 파일
.env
.env.*

# IDE
.idea/
.vscode/

# 민감정보
*.jks
*.p12
*secret*
*password*
```

**⚠️ 주의**: Submodule 자체는 `.gitmodules`로 관리되지만, **폴더 내용은 .gitignore에 추가 필수!**

---

## 8. CI/CD 설정

### GitHub Actions 예시

```yaml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true  # Submodule 포함
          token: ${{ secrets.SUBMODULE_TOKEN }}

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'

      - name: Build
        run: ./gradlew build
```

### SUBMODULE_TOKEN 설정

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Scopes: `repo` 전체 선택
4. 프로젝트 Settings → Secrets → New secret: `SUBMODULE_TOKEN`

---

## 9. 트러블슈팅

### 1. Submodule 폴더가 비어있음

```bash
git submodule update --init --recursive
```

### 2. detached HEAD 상태

```bash
cd src/main/resources/config
git checkout main
```

### 3. Permission denied (권한 없음)

- Config 저장소 접근 권한 확인
- SSH 키 설정 또는 Personal Access Token 사용

### 4. Submodule 삭제

```bash
# 1. .gitmodules 편집 (해당 섹션 삭제)
# 2. .git/config 편집 (해당 섹션 삭제)
# 3. 실행
git rm --cached src/main/resources/config
rm -rf src/main/resources/config
rm -rf .git/modules/src/main/resources/config

git commit -m "[Chore] Submodule 제거"
```

---

## 10. 보안 체크리스트

- [ ] Config 저장소는 Private
- [ ] .gitignore에 config/ 폴더 추가
- [ ] 팀원만 Config 저장소 접근 권한 부여
- [ ] Submodule 내용이 메인 저장소에 커밋되지 않았는지 확인
- [ ] CI/CD에서 SUBMODULE_TOKEN 설정
- [ ] 프로덕션은 AWS Secrets Manager/Vault 사용

---

## 11. 프로덕션 배포 시

**Submodule은 개발 환경용**, 프로덕션은 아래 방법 사용:

### AWS Secrets Manager
```yaml
# application-prod.yml
spring:
  cloud:
    aws:
      secretsmanager:
        enabled: true
        region: ap-northeast-2
```

### 환경변수 주입 (Kubernetes/ECS)
```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

---

## ✅ 체크리스트

- [ ] Private config 저장소 생성
- [ ] Submodule 추가 완료
- [ ] .gitignore에 config/ 추가
- [ ] 팀원 접근 권한 설정
- [ ] application.yml에서 config import 설정
- [ ] CI/CD에 SUBMODULE_TOKEN 설정
- [ ] 프로덕션은 Secrets Manager 사용

---

## 📚 참고

- [Git Submodule 공식 문서](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [AWS Secrets Manager Spring Boot](https://docs.awspring.io/spring-cloud-aws/docs/current/reference/html/index.html#integrating-your-spring-cloud-application-with-the-aws-secrets-manager)