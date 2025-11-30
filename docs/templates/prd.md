# PRD: [기능명]

> 📋 AI 에이전트가 일관된 결과물을 만들기 위한 기획서
> **핵심**: Why(의도)를 명확히 기록해야 AI가 올바른 판단 가능

---

## 1. 요구사항 (Requirements)

### Why - 의도 기록 (가장 중요)
> **이 섹션이 불명확하면 AI가 잘못된 방향으로 구현할 수 있습니다**

- **왜 이 기능을 만드는가?**:
- **어떤 문제를 해결하는가?**:
- **이 기능이 없으면 어떤 일이 발생하는가?**:

### 목표 (Goals)
- [ ] 목표 1
- [ ] 목표 2

### 비목표 (Non-Goals) - 명확히 제외할 것
> AI가 범위를 넘어서 구현하지 않도록 명시

- 이 PRD에서 **하지 않을 것**:
- 다음 버전으로 미룰 것:

---

## 2. 우선순위 (MoSCoW)

### Must-have (필수)
> 이것 없이는 릴리스 불가

- [ ] 필수 기능 1
- [ ] 필수 기능 2

### Should-have (권장)
> 중요하지만 필수는 아님

- [ ] 권장 기능 1

### Could-have (선택)
> 시간이 허락하면 구현

- [ ] 선택 기능 1

### Won't-have (제외)
> 이번 버전에서는 구현하지 않음

- 제외 항목 1

---

## 3. 사용자 경험 (UX)

### 사용자 스토리
```
AS A [역할]
I WANT [기능]
SO THAT [가치]
```

### 화면 흐름
1. 사용자가 [X]를 클릭한다
2. [Y] 화면이 표시된다
3. [Z]를 입력하고 제출한다

### 와이어프레임
> (스크린샷 또는 링크)

---

## 4. 기술 설계 (Technical Design)

### 의존성 (Dependencies)
- 기존 모듈: `domain/xxx`
- 외부 API: 없음
- 라이브러리: 없음

### 데이터 모델
```
Entity: EntityName
- field1: Type (설명)
- field2: Type (설명)
```

### API 설계
```
POST /api/xxx
Request: { field1, field2 }
Response: { id, ... }
```

### 영향 범위
- [ ] Backend 변경 필요
- [ ] Frontend 변경 필요
- [ ] DB 마이그레이션 필요

---

## 5. 구현 계획 (Implementation Plan)

### 작업 분해 (Work Breakdown)
| 순서 | 작업 | 레이어 | 예상 복잡도 |
|------|------|--------|-------------|
| 1 | Entity 작성 | Backend | Low |
| 2 | Repository 작성 | Backend | Low |
| 3 | Service 작성 | Backend | Medium |
| 4 | Controller 작성 | Backend | Low |
| 5 | API 연동 | Frontend | Medium |
| 6 | 컴포넌트 작성 | Frontend | Medium |

### 참조할 컨벤션
- `conventions/06-ENTITY-CONVENTIONS.md`
- `conventions/04-SERVICE-CONVENTIONS.md`
- (필요한 컨벤션 추가)

---

## 6. 리스크 분석 (Risk Analysis)

### 기술 리스크
| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 예시: N+1 쿼리 | High | Fetch Join 사용 |

### 비즈니스 리스크
- 없음

---

## 7. 테스트 계획 (Test Plan)

### 단위 테스트
- [ ] Service 테스트: `XxxServiceTest`
- [ ] Repository 테스트: `XxxRepositoryTest`

### 통합 테스트
- [ ] Controller 테스트: `XxxControllerTest`

### E2E 테스트
- [ ] 시나리오: 사용자가 [X]를 할 수 있다

### 테스트 데이터
- `DataInitializer`에 더미 데이터 추가 필요 여부: Yes/No

---

## 8. 체크리스트 (Checklist)

### 구현 전
- [ ] PRD 리뷰 완료
- [ ] 기술 설계 확정
- [ ] 의존성 확인

### 구현 중
- [ ] 컨벤션 준수
- [ ] 테스트 작성
- [ ] 코드 리뷰

### 구현 후
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트
- [ ] PR 생성

---

## 9. 결정 기록 (Decisions)

> **왜 이 방식을 선택했는지** 기록 - AI가 맥락을 이해하고 일관된 판단 가능

| 날짜 | 결정 | Why (선택 이유) | 대안 (고려했지만 선택 안 한 것) |
|------|------|----------------|-------------------------------|
| YYYY-MM-DD | 결정 내용 | 이 방식을 선택한 이유 | 대안 A: 선택 안 한 이유 |

### 결정 기록 예시
```
날짜: 2024-01-15
결정: 인증에 JWT 사용
Why: 서버 확장성 고려, 세션 서버 불필요
대안: 세션 기반 → 서버 확장 시 Redis 필요하여 제외
```

---

## 10. 참고 자료 (References)

- 관련 PRD: 없음
- 관련 ADR: 없음
- 외부 문서: 없음
