# 02. Git Conventions

> 효율적인 Git 협업 및 버전 관리

---

## 브랜치 전략

```
main (배포)
  └── dev (개발)
        ├── feat/기능명
        ├── fix/버그명
        └── refactor/개선명
```

| 브랜치 | 역할 | 규칙 |
|--------|------|------|
| `main` | 배포 | 직접 Push 금지, PR만 |
| `dev` | 개발 통합 | 직접 Push 금지, PR만 |
| `feat/*` | 기능 | `dev`에서 분기 → PR |
| `fix/*` | 버그 | `dev`에서 분기 → PR |
| `hotfix/*` | 긴급 | `main`에서 분기 → 양쪽 병합 |

---

## 브랜치 네이밍

```
타입/이슈번호-설명

feat/123-user-login
fix/456-auth-validation
```

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `docs` | 문서 |
| `test` | 테스트 |
| `chore` | 설정/빌드 |

---

## 커밋 메시지

```
[태그] 제목 (#이슈번호)

- 변경사항 1
- 변경사항 2
```

| 태그 | 예시 |
|------|------|
| `Feat` | `[Feat] 로그인 API 구현 (#123)` |
| `Fix` | `[Fix] 토큰 검증 오류 (#456)` |
| `Refactor` | `[Refactor] 서비스 분리 (#789)` |
| `Docs` | `[Docs] API 명세 작성` |
| `Test` | `[Test] 로그인 테스트 추가` |

**규칙**: 제목 50자 이내, 명령문

---

## 워크플로우

```bash
# 1. 브랜치 생성
git checkout dev && git pull origin dev
git checkout -b feat/123-user-login

# 2. 개발 & 커밋
git add . && git commit -m "[Feat] 로그인 구현 (#123)"

# 3. Push
git push origin feat/123-user-login

# 4. GitHub에서 PR 생성 (Squash and merge)

# 5. 정리
git checkout dev && git pull origin dev
git branch -d feat/123-user-login
```

---

## 민감 정보 관리

**절대 커밋 금지:**
- API Key, Secret Key, DB 비밀번호
- AWS Access Key, OAuth Client Secret

### .gitignore
```gitignore
.env
.env.*
application-local.yml
application-prod.yml
*.jks
```

> 상세 → [09-GIT-SUBMODULE-CONVENTIONS.md](./09-GIT-SUBMODULE-CONVENTIONS.md)

---

## 트러블슈팅

```bash
# 충돌 발생
git pull origin dev  # 충돌 파일 수정 후 커밋

# 실수로 민감정보 커밋
# 1. 즉시 키 무효화
# 2. 팀 공지
# 3. 새 키로 재배포
```
