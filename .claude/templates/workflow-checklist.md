# 7단계 워크플로우 체크리스트

> 📋 맥도날드화 원칙: 모든 기능 구현은 이 7단계를 순서대로 수행합니다.

---

## 🔄 워크플로우 개요

```
1. 요구사항 분석 → 2. UX 설계 → 3. 의존성 분석 → 4. 구현 계획
→ 5. 리스크 분석 → 6. 구현 → 7. 테스트 & 검증
```

---

## 1️⃣ 요구사항 분석 (Requirements Analysis)

### 체크리스트
- [ ] 사용자 요청 명확히 이해
- [ ] 비즈니스 목표 파악
- [ ] 범위(Scope) 정의
- [ ] 비목표(Non-Goals) 명시

### 산출물
- PRD 섹션 1 (요구사항) 작성 완료

### 질문
- 이 기능의 핵심 가치는?
- 누가 사용하는가?
- 성공 기준은?

---

## 2️⃣ UX 설계 (User Experience Design)

### 체크리스트
- [ ] 사용자 스토리 작성 (AS A... I WANT... SO THAT...)
- [ ] 화면 흐름 정의
- [ ] 주요 인터랙션 정의
- [ ] 에러 케이스 고려

### 산출물
- PRD 섹션 3 (UX) 작성 완료

### 질문
- 사용자가 어떤 순서로 동작하는가?
- 예외 상황은 어떻게 처리하는가?

---

## 3️⃣ 의존성 분석 (Dependency Analysis)

### 체크리스트
- [ ] 기존 코드베이스 탐색
- [ ] 재사용 가능한 모듈 확인
- [ ] 필요한 외부 라이브러리 확인
- [ ] DB 스키마 변경 필요 여부

### 산출물
- PRD 섹션 4 (기술 설계 - 의존성) 작성 완료

### 질문
- 기존에 비슷한 기능이 있는가?
- 어떤 모듈을 재사용할 수 있는가?

---

## 4️⃣ 구현 계획 (Implementation Plan)

### 체크리스트
- [ ] 작업 분해 (WBS)
- [ ] 레이어별 작업 순서 정의
- [ ] 참조할 컨벤션 문서 확인
- [ ] MoSCoW 우선순위 적용

### 산출물
- PRD 섹션 5 (구현 계획) 작성 완료
- TodoWrite로 작업 목록 생성

### 작업 순서 (Backend)
```
Entity → Repository → DTO → Exception → Service → Controller
```

### 작업 순서 (Frontend)
```
Types → API Service → React Query Hooks → Component
```

---

## 5️⃣ 리스크 분석 (Risk Analysis)

### 체크리스트
- [ ] 기술 리스크 식별
- [ ] N+1 쿼리 가능성 체크
- [ ] 보안 취약점 체크 (OWASP Top 10)
- [ ] 성능 병목 가능성 체크

### 산출물
- PRD 섹션 6 (리스크 분석) 작성 완료

### 주요 리스크 패턴
| 리스크 | 확인 방법 | 해결책 |
|--------|-----------|--------|
| N+1 쿼리 | 연관관계 있는 조회 | Fetch Join |
| XSS | 사용자 입력 출력 | 이스케이프 처리 |
| SQL Injection | 동적 쿼리 | Parameterized Query |

---

## 6️⃣ 구현 (Implementation)

### 체크리스트
- [ ] 컨벤션 문서 참조
- [ ] TodoWrite로 진행 상황 추적
- [ ] 각 레이어 체크포인트 확인
- [ ] 코드 리뷰 수행

### 레이어별 체크포인트

**Entity**
- [ ] BaseTimeEntity 상속
- [ ] Setter 금지 (비즈니스 메서드로 대체)
- [ ] @Enumerated(EnumType.STRING)

**Repository**
- [ ] JpaRepository 상속
- [ ] Fetch Join으로 N+1 해결

**Service**
- [ ] @Transactional(readOnly = true) 클래스 레벨
- [ ] 쓰기 메서드는 @Transactional
- [ ] 예외는 Service에서 throw

**Controller**
- [ ] @Valid로 요청 검증
- [ ] try-catch 금지 (GlobalExceptionHandler 위임)

**Frontend Component**
- [ ] Props Destructuring
- [ ] any 타입 금지
- [ ] React Query로 서버 상태 관리

---

## 7️⃣ 테스트 & 검증 (Test & Verification)

### 체크리스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 수동 테스트 수행
- [ ] 테스트 커버리지 ≥ 80%

### 테스트 패턴
```
// Backend: Given-When-Then
@Test
@DisplayName("사용자가 [X]를 하면 [Y]가 된다")
void test() {
    // given
    // when
    // then
}

// Frontend: Arrange-Act-Assert
test('사용자가 [X]를 하면 [Y]가 된다', async () => {
    // Arrange
    // Act
    // Assert
});
```

### 최종 검증
- [ ] 모든 테스트 통과 (`./gradlew test`, `npm test`)
- [ ] 린터 통과 (`./gradlew check`, `npm run lint`)
- [ ] PR 생성 및 리뷰 요청

---

## 📊 진행 상황 템플릿

```markdown
## 현재 단계: [N]단계 - [단계명]

### 완료된 단계
- [x] 1단계: 요구사항 분석
- [x] 2단계: UX 설계
- [ ] 3단계: 의존성 분석
- [ ] 4단계: 구현 계획
- [ ] 5단계: 리스크 분석
- [ ] 6단계: 구현
- [ ] 7단계: 테스트

### 현재 작업
- 작업 중인 내용...

### 다음 작업
- 다음에 할 내용...
```

---

## 🔗 관련 문서

- [PRD 템플릿](.claude/templates/prd.md)
- [ADR 템플릿](docs/adr/000-template.md)
- [컨벤션 가이드](conventions/README.md)
