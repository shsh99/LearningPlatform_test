# 02. Git Conventions

**목적**: 효율적인 Git 협업 및 버전 관리

---

## 1. 브랜치 전략

### 구조
```
main (배포)
  └── dev (개발)
        ├── feat/기능명
        ├── fix/버그명
        └── refactor/개선명
```

### 브랜치별 역할

| 브랜치 | 역할 | 규칙 |
|--------|------|------|
| `main` | 배포 버전 | 직접 Push 금지, PR만 허용 |
| `dev` | 개발 통합 | 직접 Push 금지, PR만 허용 |
| `feat/*` | 기능 개발 | `dev`에서 분기, 작업 후 PR |
| `fix/*` | 버그 수정 | `dev`에서 분기, 작업 후 PR |
| `hotfix/*` | 긴급 수정 | `main`에서 분기, `main`+`dev` 양쪽 병합 |

---

## 2. 브랜치 네이밍

### 형식
```
타입/이슈번호-설명

예시:
feat/123-user-login
fix/456-auth-validation
refactor/789-service-layer
```

### 타입

| 타입 | 용도 | 예시 |
|------|------|------|
| `feat` | 새 기능 | `feat/123-user-login` |
| `fix` | 버그 수정 | `fix/456-token-validation` |
| `refactor` | 리팩토링 | `refactor/789-service-layer` |
| `docs` | 문서 | `docs/012-api-spec` |
| `test` | 테스트 | `test/345-login-test` |
| `chore` | 설정/빌드 | `chore/678-env-setup` |

---

## 3. 커밋 메시지

### 형식
```
[태그] 제목 (#이슈번호)

본문 (선택)
- 변경사항 1
- 변경사항 2
```

### 태그

| 태그 | 의미 | 예시 |
|------|------|------|
| `Feat` | 기능 추가 | `[Feat] 로그인 API 구현 (#123)` |
| `Fix` | 버그 수정 | `[Fix] 토큰 검증 오류 수정 (#456)` |
| `Refactor` | 리팩토링 | `[Refactor] 서비스 레이어 분리 (#789)` |
| `Docs` | 문서 | `[Docs] API 명세 작성 (#012)` |
| `Test` | 테스트 | `[Test] 로그인 테스트 추가 (#345)` |
| `Style` | 코드 포맷 | `[Style] 코드 포맷팅 (#678)` |
| `Chore` | 기타 | `[Chore] ESLint 설정 (#901)` |

### 예시

**간단한 커밋**:
```
[Feat] 회원가입 API 구현 (#123)
```

**상세한 커밋** (권장):
```
[Feat] 회원가입 API 구현 (#123)

- 이메일/비밀번호 검증 추가
- BCrypt 암호화 적용
- 중복 이메일 체크
- 201 Created 응답
```

### 작성 규칙
- 제목: 50자 이내, 명령문 ("추가한다" ❌ → "추가" ✅)
- 본문: 핵심 변경사항만

---

## 4. 기본 워크플로우

### Step 1: 브랜치 생성
```bash
git checkout dev
git pull origin dev
git checkout -b feat/123-user-login
```

### Step 2: 개발 & 커밋
```bash
# 작업...

git status
git add .
git commit -m "[Feat] 로그인 기능 구현 (#123)"
```

### Step 3: Push
```bash
git push origin feat/123-user-login
```

### Step 4: PR 생성 (GitHub)
```markdown
## 작업 내용
- 로그인 API 구현
- JWT 토큰 발급

## 주요 변경사항
- POST /api/auth/login 추가
- 토큰 검증 미들웨어 작성

## 테스트
- [x] 로컬 테스트 완료
```

### Step 5: 병합 & 정리
```bash
# GitHub에서 "Squash and merge"

git checkout dev
git pull origin dev
git branch -d feat/123-user-login
```

---

## 5. 자주 쓰는 명령어

### 브랜치
```bash
# 브랜치 목록
git branch -a

# 원격 브랜치 삭제
git push origin --delete feat/123-feature

# 병합된 브랜치 일괄 삭제
git branch --merged | grep -v "\*\|main\|dev" | xargs git branch -d
```

### 변경사항
```bash
# 그래프로 보기
git log --oneline --graph --all

# 특정 파일 이력
git log -p 파일명

# 임시 저장
git stash
git stash pop
```

### 충돌 해결
```bash
# dev 최신 반영
git pull origin dev

# 충돌 파일 확인
git status

# 수정 후
git add .
git commit -m "[Fix] 충돌 해결"
git push
```

---

## 6. 민감 정보 관리

### 원칙
**절대 Git에 커밋하지 말 것:**
- API 키, Secret Key
- DB 비밀번호
- AWS Access Key
- OAuth Client Secret
- 개인정보 (이메일, 전화번호)

### .gitignore 설정
```gitignore
# 환경변수
.env
.env.*
application-local.yml
application-prod.yml

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# 빌드
node_modules/
dist/
build/
target/
*.log

# 민감정보 (절대 커밋 금지!)
*.pem
*.key
*secret*
*password*
credentials.json
*.jks
keystore.p12
```

### 환경변수 관리

**개발 환경:**
```bash
# .env (gitignore에 추가됨)
DB_PASSWORD=dev_password
JWT_SECRET=dev_secret_key_123
AWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
```

**프로덕션 환경:**
- GitHub Secrets 사용
- AWS Systems Manager Parameter Store
- Vault, AWS Secrets Manager

### 실수로 커밋한 경우

**1. 즉시 키 무효화** (AWS, DB 비밀번호 변경)

**2. Git 히스토리에서 제거** (협업 중이면 팀에 공지)
```bash
# 최근 커밋에서만 제거 (Push 전)
git rm --cached .env
git commit --amend

# 히스토리 전체에서 제거 (위험! 협의 필요)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

**3. Force Push 금지 → 새 키로 재배포**

### 템플릿 파일 관리

```bash
# application.yml (커밋 O)
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

# application-example.yml (커밋 O, 팀원 참고용)
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: YOUR_PASSWORD_HERE
```

---

## 7. .gitignore 예시

### Java/Spring Boot
```gitignore
# Gradle
.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup

# 환경설정
application-local.yml
application-prod.yml
.env

# IDE
.idea/
*.iml
.vscode/

# 민감정보
*.jks
keystore.p12
*secret*
*password*
credentials.json
```

---

## 8. PR 템플릿

### 기본 구조
```markdown
## 📝 작업 내용
- 기능 설명

## 🔧 주요 변경사항
- 파일/기능 변경 내역

## 🧪 테스트
- [ ] 로컬 테스트
- [ ] 통합 테스트

## 💬 리뷰 포인트
- 확인 필요 사항
```

---

## 9. 트러블슈팅

### 1. 잘못된 브랜치로 PR
```
GitHub에서 base 브랜치 변경: main → dev
```

### 2. 충돌 발생
```bash
git pull origin dev
# 충돌 파일 수정
git add .
git commit -m "[Fix] 충돌 해결"
git push
```

### 3. 실수로 main Push
```bash
# ⚠️ force push 금지!
# 팀에 연락 후 revert
git revert <커밋해시>
```

### 4. 커밋 메시지 수정
```bash
# Push 전
git commit --amend

# Push 후
# 그대로 두거나 새 커밋으로 수정
```

---

## ✅ 체크리스트

- [ ] 브랜치 네이밍 규칙 준수
- [ ] 커밋 메시지 형식 준수
- [ ] main/dev에 직접 Push 금지
- [ ] PR 템플릿 작성
- [ ] 병합 후 브랜치 삭제
- [ ] .gitignore 설정
- [ ] 민감정보 커밋 안 함

---

## 📚 참고

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [좋은 커밋 메시지](https://cbea.ms/git-commit/)
