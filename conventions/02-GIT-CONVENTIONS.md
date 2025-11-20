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

## 5. 민감 정보 관리

> 📌 **상세 가이드**: [09-GIT-SUBMODULE-CONVENTIONS.md](./09-GIT-SUBMODULE-CONVENTIONS.md) - Submodule을 활용한 민감 정보 관리

### 기본 원칙
**절대 Git에 커밋하지 말 것:**
- API 키, Secret Key, DB 비밀번호
- AWS Access Key, OAuth Client Secret
- 개인정보 (이메일, 전화번호)

### .gitignore 필수 설정
```gitignore
.env
.env.*
application-local.yml
application-prod.yml
```

### 실수로 커밋한 경우
1. **즉시 키 무효화** (AWS, DB 비밀번호 변경)
2. **팀에 공지 후 조치**
3. **새 키로 재배포**

---

## 6. .gitignore 예시

```gitignore
# 환경설정
.env
.env.*
application-local.yml

# IDE
.idea/
.vscode/

# 민감정보
*.jks
*secret*
*password*
```

---

## 7. 트러블슈팅

### 1. 잘못된 브랜치로 PR
```
GitHub에서 base 브랜치 변경: main → dev
```

### 2. 충돌 발생
```bash
git pull origin dev
# 충돌 파일 수정 후 커밋
```

**PR 템플릿**: 별도 `.github/pull_request_template.md` 파일로 관리 권장

---

## 📚 참고

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [좋은 커밋 메시지](https://cbea.ms/git-commit/)
