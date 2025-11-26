# 09. Git Submodule Conventions

> Private 저장소로 민감 정보(설정 파일) 관리

**적합**: 개발/로컬 환경, 소규모 팀
**비적합**: 프로덕션 (AWS Secrets Manager/Vault 권장)

---

## 프로젝트 구조

```
your-project/
├── src/main/resources/
│   ├── application.yml      # 커밋 O (환경변수 참조)
│   └── config/              # Submodule (커밋 X)
│       ├── application-dev.yml
│       └── application-local.yml
└── .gitmodules              # 자동 생성
```

---

## 초기 설정

### 1. Private 저장소 생성
GitHub에서 `your-project-config` Private 저장소 생성

### 2. Submodule 추가
```bash
cd your-project
git submodule add https://github.com/org/your-project-config.git src/main/resources/config
echo "src/main/resources/config/" >> .gitignore
git commit -m "chore: Add config submodule"
```

---

## 팀원 설정

```bash
# 클론 시 submodule 포함
git clone --recurse-submodules https://github.com/org/your-project.git

# 또는 기존 클론 후
git submodule update --init --recursive
```

---

## 일상 작업

### Submodule 최신화
```bash
git submodule update --remote
```

### 설정 수정
```bash
cd src/main/resources/config
git checkout main && git pull
# 수정 후
git add . && git commit -m "fix: Update DB password"
git push

# 메인 프로젝트에서
cd ../../../..
git add src/main/resources/config
git commit -m "chore: Update config submodule"
```

---

## Spring Boot 통합

### application.yml (메인)
```yaml
spring:
  profiles.active: local
  config.import: classpath:config/application-${spring.profiles.active}.yml
```

### 실행
```bash
./gradlew bootRun --args='--spring.profiles.active=dev'
```

---

## CI/CD (GitHub Actions)

```yaml
- uses: actions/checkout@v4
  with:
    submodules: true
    token: ${{ secrets.SUBMODULE_TOKEN }}
```

**SUBMODULE_TOKEN**: GitHub PAT (repo 권한) → Repository Secrets에 등록

---

## 트러블슈팅

| 문제 | 해결 |
|------|------|
| 폴더 비어있음 | `git submodule update --init --recursive` |
| detached HEAD | `cd config && git checkout main` |
| 권한 없음 | Config 저장소 접근 권한 확인 |

---

## 보안 체크리스트

- [ ] Config 저장소는 Private
- [ ] .gitignore에 config/ 추가
- [ ] 팀원만 접근 권한
- [ ] 프로덕션은 Secrets Manager 사용
