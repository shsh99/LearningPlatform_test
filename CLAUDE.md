# Claude AI 작업 가이드

**목적**: AI가 LearningPlatform 프로젝트에서 효율적으로 작업하기 위한 메타 가이드

---

## 🎯 프로젝트 컨텍스트

### 프로젝트 정보
```
이름: LearningPlatform
구조: Monorepo (Backend + Frontend)
Backend: Spring Boot 3.2 + Java 17-21
Frontend: React 19 + TypeScript 5 + Vite
상태: 초기 설정 단계 (컨벤션 정의 완료, 구현 전)
```

### 핵심 원칙
```
✅ 컨벤션 우선: 모든 코드는 conventions/ 규칙을 따름
✅ 토큰 최적화: 필요한 컨벤션만 선택적으로 읽기
✅ 작업 추적: TodoWrite로 진행 상황 실시간 기록
✅ 단계별 진행: 의존성 순서대로 구현 (Entity → Repository → Service → Controller)
```

---

## 📚 컨벤션 로딩 전략

### 원칙
```
❌ 모든 컨벤션 파일을 읽지 않음 (토큰 낭비)
✅ 작업 유형에 따라 필요한 컨벤션만 선택적으로 읽음
✅ 공통 규칙(00-CONVENTIONS-CORE.md)은 자주 참조
```

---

## 🔵 Backend 작업 시 컨벤션 매핑

### Entity 작성
```
필수:
- conventions/00-CONVENTIONS-CORE.md (공통 규칙)
- conventions/06-ENTITY-CONVENTIONS.md (Setter 금지!)

선택:
- conventions/01-PROJECT-STRUCTURE.md (패키지 구조 확인 시)
```

**체크포인트**:
- [ ] BaseTimeEntity 상속 확인
- [ ] Setter 메서드 없음 (비즈니스 메서드로 대체)
- [ ] Enum은 STRING 타입
- [ ] 연관관계 주인 설정

---

### Repository 작성
```
필수:
- conventions/00-CONVENTIONS-CORE.md
- conventions/05-REPOSITORY-CONVENTIONS.md (Query Methods, N+1)

참고:
- conventions/06-ENTITY-CONVENTIONS.md (Entity 구조 확인)
```

**체크포인트**:
- [ ] JpaRepository 상속
- [ ] 메서드명 규칙 (findBy, existsBy)
- [ ] N+1 문제: Fetch Join 사용
- [ ] Custom Repository 필요 시 분리

---

### Service 작성
```
필수:
- conventions/00-CONVENTIONS-CORE.md
- conventions/04-SERVICE-CONVENTIONS.md (Transaction, DTO 변환)

참고:
- conventions/06-ENTITY-CONVENTIONS.md (Entity 생성 메서드)
- conventions/07-DTO-CONVENTIONS.md (DTO 구조)
- conventions/08-EXCEPTION-CONVENTIONS.md (예외 처리)
```

**체크포인트**:
- [ ] @Transactional(readOnly = true) 클래스 레벨
- [ ] 쓰기 메서드는 @Transactional
- [ ] Entity → DTO: `DTO.from(entity)`
- [ ] DTO → Entity: `Entity.create(params)`
- [ ] 예외는 Service에서 throw (Controller에서 catch 금지)

---

### DTO 작성
```
필수:
- conventions/00-CONVENTIONS-CORE.md
- conventions/07-DTO-CONVENTIONS.md (Record, Validation)

참고:
- conventions/03-CONTROLLER-CONVENTIONS.md (Request/Response 구조)
```

**체크포인트**:
- [ ] Java Record 사용
- [ ] Request DTO: @Valid + Validation 애노테이션
- [ ] Response DTO: `from(Entity entity)` 정적 팩토리 메서드
- [ ] Nested DTO는 내부 클래스로

---

### Exception 작성
```
필수:
- conventions/00-CONVENTIONS-CORE.md
- conventions/08-EXCEPTION-CONVENTIONS.md (ErrorCode, GlobalExceptionHandler)
```

**체크포인트**:
- [ ] BusinessException 상속
- [ ] ErrorCode Enum 정의
- [ ] 생성자에서 ErrorCode 전달
- [ ] GlobalExceptionHandler는 공통 예외만 처리

---

### Controller 작성
```
필수:
- conventions/00-CONVENTIONS-CORE.md
- conventions/03-CONTROLLER-CONVENTIONS.md (RESTful API, Validation)

참고:
- conventions/07-DTO-CONVENTIONS.md (Request/Response DTO)
- conventions/08-EXCEPTION-CONVENTIONS.md (예외는 GlobalExceptionHandler에 위임)
```

**체크포인트**:
- [ ] @RestController + @RequestMapping("/api/xxx")
- [ ] HTTP 메서드 매핑 (@GetMapping, @PostMapping 등)
- [ ] @Valid로 Request DTO 검증
- [ ] ResponseEntity 사용 (상태 코드 명시)
- [ ] try-catch 사용 금지 (GlobalExceptionHandler에 위임)

---

### Test 작성
```
필수:
- conventions/15-TEST-CONVENTIONS.md (JUnit5, MockMvc, Given-When-Then)

참고:
- 테스트 대상 레이어 컨벤션 (Controller, Service, Repository)
```

**체크포인트**:
- [ ] Controller: @WebMvcTest + MockMvc
- [ ] Service: @ExtendWith(MockitoExtension.class)
- [ ] Repository: @DataJpaTest
- [ ] Given-When-Then 패턴
- [ ] @DisplayName으로 한글 설명

---

## 🟢 Frontend 작업 시 컨벤션 매핑

### Component 작성
```
필수:
- conventions/10-REACT-TYPESCRIPT-CORE.md (기본 규칙, 네이밍)
- conventions/12-REACT-COMPONENT-CONVENTIONS.md (컴포넌트 템플릿)

선택:
- conventions/11-REACT-PROJECT-STRUCTURE.md (폴더 구조 확인 시)
```

**체크포인트**:
- [ ] Props Destructuring
- [ ] 명시적 타입 정의 (any 금지)
- [ ] Early Return 패턴
- [ ] 컴포넌트 순서: State → Effects → Handlers → Render
- [ ] key prop (리스트 렌더링)

---

### API Service 작성
```
필수:
- conventions/10-REACT-TYPESCRIPT-CORE.md
- conventions/14-REACT-API-INTEGRATION.md (Axios, React Query)

참고:
- conventions/13-REACT-STATE-MANAGEMENT.md (서버 상태는 React Query)
```

**체크포인트**:
- [ ] Axios Instance 사용 (axiosInstance.ts)
- [ ] API Endpoints 상수화
- [ ] 타입 정의 (Request, Response)
- [ ] React Query 사용 (useQuery, useMutation)
- [ ] 에러 처리 (handleApiError)

---

### State Management
```
필수:
- conventions/10-REACT-TYPESCRIPT-CORE.md
- conventions/13-REACT-STATE-MANAGEMENT.md (useState, Zustand, React Query)
```

**체크포인트**:
- [ ] Local State: useState
- [ ] 공유 State: Context API or Zustand
- [ ] 서버 State: React Query (useState 금지)
- [ ] 불변성 유지 (객체/배열 업데이트)

---

### Test 작성
```
필수:
- conventions/15-TEST-CONVENTIONS.md (React Testing Library, MSW)

참고:
- conventions/12-REACT-COMPONENT-CONVENTIONS.md (컴포넌트 구조)
```

**체크포인트**:
- [ ] React Testing Library 사용
- [ ] userEvent (fireEvent 대신)
- [ ] getByRole 우선 (getByTestId는 최후)
- [ ] MSW로 API Mock
- [ ] Arrange-Act-Assert 패턴

---

## 🔄 Git 작업 시 컨벤션 매핑

### Commit 작성
```
필수:
- conventions/02-GIT-CONVENTIONS.md (Conventional Commits)
```

**형식**:
```
feat(backend): Add User CRUD API
fix(frontend): Resolve login button state
test(backend): Add UserService unit tests
docs: Update API specification
```

**체크포인트**:
- [ ] Conventional Commits 형식
- [ ] 영문 커밋 메시지
- [ ] Scope 명시 (backend, frontend)
- [ ] HEREDOC 사용 (git commit -m "$(cat <<'EOF')")

---

### Pull Request 작성
```
필수:
- conventions/02-GIT-CONVENTIONS.md (PR 가이드)
```

**체크포인트**:
- [ ] PR 제목: feat/fix/refactor 등
- [ ] PR 본문: Summary + Test plan
- [ ] 모든 테스트 통과
- [ ] Linter 통과
- [ ] 커버리지 ≥ 80%

---

## 🎯 작업 플로우

### 1. 요청 분석
```
사용자 요청 → 작업 유형 파악 → 필요한 컨벤션 확인
```

### 2. 작업 계획 (TodoWrite)
```markdown
✅ TodoWrite로 작업 목록 생성
✅ 의존성 순서대로 나열 (Entity → Repository → Service → Controller)
✅ 각 작업에 activeForm 명시
```

**예시**:
```
1. ⏳ Entity 작성 (User.java, UserStatus.java)
2. ⏸️ Repository 작성 (UserRepository.java)
3. ⏸️ DTO 작성 (CreateUserRequest, UserResponse)
4. ⏸️ Exception 작성 (UserNotFoundException)
5. ⏸️ Service 작성 (UserService, UserServiceImpl)
6. ⏸️ Controller 작성 (UserController)
7. ⏸️ Test 작성 (UserControllerTest, UserServiceTest)
```

---

### 3. 컨벤션 로딩
```
✅ 작업 유형별 "필수" 컨벤션만 읽기
✅ "참고" 컨벤션은 필요 시에만 읽기
```

**예시**:
```
Entity 작성 시:
→ 00-CONVENTIONS-CORE.md 읽기
→ 06-ENTITY-CONVENTIONS.md 읽기
→ Setter 금지, BaseTimeEntity 상속 확인
```

---

### 4. 코드 작성
```
✅ 컨벤션에 명시된 템플릿 참고
✅ 체크포인트 확인하며 작성
✅ ❌/✅ 예시 코드 참고
```

---

### 5. 작업 완료 기록
```
✅ 작업 시작: status = "in_progress"
✅ 작업 완료: status = "completed"
✅ 다음 작업으로 이동
```

---

### 6. 최종 요약
```markdown
## 완료된 작업
1. ✅ Entity: User.java, UserStatus.java
2. ✅ Repository: UserRepository.java
...

## 변경된 파일
- backend/src/main/java/.../User.java
- backend/src/main/java/.../UserRepository.java
...

## 다음 단계
- 테스트 실행: ./gradlew test
- API 테스트: POST /api/users
```

---

## 🚫 금지 사항

### 절대 하지 말 것
```
❌ 모든 컨벤션 파일을 한 번에 읽기 (토큰 낭비)
❌ 컨벤션 없이 코드 작성
❌ 작업 진행 상황을 TodoWrite에 기록하지 않음
❌ Entity에 Setter 추가
❌ Controller에서 try-catch 사용
❌ DTO에 toEntity() 메서드 추가
❌ @Enumerated(EnumType.ORDINAL) 사용
❌ Frontend에서 any 타입 사용
❌ 서버 상태를 useState로 관리
```

---

## 💡 Best Practices

### 컨벤션 로딩 최적화
```
✅ 공통 규칙(00-CONVENTIONS-CORE.md)은 캐싱
✅ 레이어별 컨벤션은 필요 시마다 읽기
✅ 참고 컨벤션은 불확실할 때만 읽기
```

---

### 작업 순서 최적화
```
✅ Backend: Entity → Repository → Service → Controller → Test
✅ Frontend: Types → API Service → Component → Test
✅ 의존성 역순으로 작성 (하위 레이어부터)
```

---

### 에러 처리 전략
```
✅ Backend: Service에서 throw → GlobalExceptionHandler
✅ Frontend: Axios Interceptor → handleApiError → Toast/Alert
✅ 일관된 에러 응답 형식
```

---

## 📖 주요 참조 문서

### 메타 문서
- [MONOREPO.md](./MONOREPO.md) - 프로젝트 구조, 환경 설정, 배포
- [conventions/README.md](./conventions/README.md) - 컨벤션 목차

### 핵심 컨벤션
- [00-CONVENTIONS-CORE.md](./conventions/00-CONVENTIONS-CORE.md) - Backend 공통 규칙
- [10-REACT-TYPESCRIPT-CORE.md](./conventions/10-REACT-TYPESCRIPT-CORE.md) - Frontend 공통 규칙

### 구조 가이드
- [01-PROJECT-STRUCTURE.md](./conventions/01-PROJECT-STRUCTURE.md) - Backend 구조
- [11-REACT-PROJECT-STRUCTURE.md](./conventions/11-REACT-PROJECT-STRUCTURE.md) - Frontend 구조

---

## 🎯 작업 유형별 빠른 참조

### Backend CRUD API 구현
```
1. Entity (06) → 2. Repository (05) → 3. DTO (07)
→ 4. Exception (08) → 5. Service (04) → 6. Controller (03)
→ 7. Test (15)
```

### Frontend 페이지 구현
```
1. Types (10) → 2. API Service (14) → 3. React Query Hooks (14)
→ 4. Component (12) → 5. State (13) → 6. Test (15)
```

### 인증 시스템 구현
```
Backend: SecurityConfig → JWT → AuthService → AuthController
Frontend: Axios Interceptor → AuthContext → LoginPage → ProtectedRoute
```

---

## 🔍 디버깅 체크리스트

### Backend 에러 발생 시
```
1. Setter 사용 여부 확인 (Entity)
2. @Transactional 누락 확인 (Service 쓰기 메서드)
3. N+1 쿼리 확인 (Repository Fetch Join)
4. ErrorCode 정의 확인 (Exception)
5. Validation 애노테이션 확인 (DTO)
```

### Frontend 에러 발생 시
```
1. any 타입 사용 여부 확인
2. Props Destructuring 확인
3. key prop 확인 (리스트 렌더링)
4. 서버 상태를 useState로 관리하는지 확인 (React Query 사용)
5. API 에러 처리 확인 (handleApiError)
```

---

## 📊 성능 체크리스트

### Backend
```
- [ ] N+1 쿼리 해결 (Fetch Join, EntityGraph)
- [ ] 불필요한 @Transactional 제거 (읽기 전용은 readOnly=true)
- [ ] Index 설정 (자주 조회하는 컬럼)
- [ ] Connection Pool 설정 (HikariCP)
```

### Frontend
```
- [ ] Bundle Size < 500KB (Code Splitting)
- [ ] Image Optimization (WebP, Lazy Loading)
- [ ] React Query 캐싱 (staleTime 5분)
- [ ] 불필요한 Re-render 방지 (useMemo, useCallback)
```

---

## 🎓 학습 순서 (신규 개발자용)

### Backend
```
1. 00-CONVENTIONS-CORE.md (핵심 규칙)
2. 01-PROJECT-STRUCTURE.md (프로젝트 구조)
3. 06-ENTITY-CONVENTIONS.md (Entity - Setter 금지!)
4. 07-DTO-CONVENTIONS.md (DTO)
5. 04-SERVICE-CONVENTIONS.md (Service)
6. 03-CONTROLLER-CONVENTIONS.md (Controller)
7. 05-REPOSITORY-CONVENTIONS.md (Repository)
8. 08-EXCEPTION-CONVENTIONS.md (Exception)
9. 15-TEST-CONVENTIONS.md (Test)
```

### Frontend
```
1. 10-REACT-TYPESCRIPT-CORE.md (핵심 규칙)
2. 11-REACT-PROJECT-STRUCTURE.md (프로젝트 구조)
3. 12-REACT-COMPONENT-CONVENTIONS.md (Component)
4. 13-REACT-STATE-MANAGEMENT.md (State)
5. 14-REACT-API-INTEGRATION.md (API)
6. 15-TEST-CONVENTIONS.md (Test)
```

---

## 🚀 다음 단계

### 프로젝트 초기화 (우선순위)
```
1. backend/ 폴더 생성 (Spring Initializr)
2. frontend/ 폴더 생성 (Vite + React + TypeScript)
3. 공통 클래스 작성 (BaseEntity, GlobalExceptionHandler, ErrorCode)
4. 환경 설정 (application.yml, .env, vite.config.ts)
5. Git 설정 (.gitignore, 브랜치 전략)
```

**참고**: [MONOREPO.md - 프로젝트 초기 설정 체크리스트](./MONOREPO.md#🎯-프로젝트-초기-설정-체크리스트)

---

**이 파일은 AI 전용 가이드입니다. 사람이 읽을 때는 [MONOREPO.md](./MONOREPO.md)를 참고하세요.**
