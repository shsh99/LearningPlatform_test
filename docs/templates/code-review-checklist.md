# Code Review Checklist

> AI 작업 결과물 검토 기준
> **AI 또는 사람이 코드 리뷰 시 확인할 항목**

---

## 사용 방법

```
1. AI 작업 완료 후 이 체크리스트로 검토
2. 해당 작업 유형의 섹션만 확인
3. 이슈 발견 시 수정 요청
```

---

## 공통 체크리스트

### 코드 품질
- [ ] 컨벤션 준수 (해당 XX-CONVENTIONS.md 확인)
- [ ] 불필요한 코드/주석 없음
- [ ] 의미 있는 변수/함수명 사용
- [ ] 중복 코드 없음
- [ ] 매직 넘버 대신 상수 사용

### 안전성
- [ ] 민감 정보 노출 없음 (비밀번호, 키 등)
- [ ] SQL Injection 취약점 없음
- [ ] 입력값 검증 존재
- [ ] 적절한 에러 처리

---

## Backend 체크리스트

### Entity
- [ ] `@Entity`, `@Table` 어노테이션
- [ ] Setter 없음 (비즈니스 메서드로 대체)
- [ ] `@Enumerated(EnumType.STRING)` 사용
- [ ] BaseTimeEntity 상속 (createdAt, updatedAt)
- [ ] 연관관계 적절히 설정

### Repository
- [ ] JpaRepository 상속
- [ ] 커스텀 쿼리에 `@Query` 사용
- [ ] 파라미터 바인딩 (`:param`) 사용
- [ ] N+1 해결 (Fetch Join / EntityGraph)

### Service
- [ ] `@Service` 어노테이션
- [ ] `@Transactional(readOnly = true)` 클래스 레벨
- [ ] 쓰기 메서드에 `@Transactional` 오버라이드
- [ ] 생성자 주입 (final 필드)
- [ ] 비즈니스 로직 검증 존재

### Controller
- [ ] `@RestController`, `@RequestMapping` 설정
- [ ] 적절한 HTTP 메서드 (GET/POST/PUT/DELETE)
- [ ] `@Valid`로 요청 검증
- [ ] try-catch 없음 (GlobalExceptionHandler 사용)
- [ ] ResponseEntity 또는 공통 응답 형식 사용

### DTO
- [ ] Java Record 사용
- [ ] `from()` 정적 팩토리 메서드
- [ ] Bean Validation 어노테이션 (`@NotBlank`, `@Email` 등)
- [ ] 민감 정보 제외 (password 등)

### Exception
- [ ] 커스텀 Exception 생성
- [ ] 적절한 HTTP 상태 코드
- [ ] 명확한 에러 메시지
- [ ] GlobalExceptionHandler에 핸들러 추가

---

## Frontend 체크리스트

### Component
- [ ] Props 타입 정의 (interface)
- [ ] Props Destructuring 사용
- [ ] Early Return 패턴 적용
- [ ] `any` 타입 없음
- [ ] 불필요한 `useEffect` 없음

### API Service
- [ ] Axios 인스턴스 사용
- [ ] 타입 정의 (Request/Response)
- [ ] 에러 핸들링 (handleApiError)
- [ ] 인터셉터 설정 (토큰 추가)

### State Management
- [ ] 서버 상태: React Query 사용
- [ ] 클라이언트 상태: useState/useReducer
- [ ] 적절한 캐싱 설정 (staleTime, cacheTime)
- [ ] 로딩/에러 상태 처리

### 스타일
- [ ] TailwindCSS 유틸리티 사용
- [ ] 일관된 디자인 토큰 (색상, 간격)
- [ ] 반응형 처리 (sm, md, lg)

---

## 테스트 체크리스트

### Backend Test
- [ ] 단위 테스트 존재
- [ ] given-when-then 패턴
- [ ] 모킹 적절히 사용
- [ ] 경계값 테스트
- [ ] 실패 케이스 테스트

### Frontend Test
- [ ] 컴포넌트 렌더링 테스트
- [ ] 사용자 상호작용 테스트
- [ ] API 모킹 처리
- [ ] 에러 상태 테스트

---

## 보안 체크리스트

- [ ] JWT 토큰 올바르게 처리
- [ ] 권한 검사 존재 (`@PreAuthorize`)
- [ ] CORS 설정 적절
- [ ] 파일 업로드 시 검증
- [ ] 로그에 민감 정보 없음

---

## 성능 체크리스트

- [ ] N+1 쿼리 없음
- [ ] 불필요한 DB 조회 없음
- [ ] 페이지네이션 적용 (대량 데이터)
- [ ] 불필요한 리렌더링 없음 (React)
- [ ] 무거운 연산 메모이제이션

---

## 리뷰 코멘트 작성 가이드

### 좋은 코멘트
```
[필수] Entity에 Setter가 있습니다. 비즈니스 메서드로 변경해주세요.
- 현재: setStatus(Status status)
- 변경: updateStatus(Status newStatus)
- 참조: 06-ENTITY-CONVENTIONS.md
```

### 피해야 할 코멘트
```
❌ "이거 이상해요"
❌ "다시 해주세요"
❌ 이유 없는 변경 요청
```

---

## 작업 유형별 빠른 체크

| 작업 | 필수 확인 |
|------|----------|
| Entity 생성 | Setter 없음, EnumType.STRING |
| API 추가 | 컨트롤러 + 서비스 + DTO + 테스트 |
| 버그 수정 | 회귀 테스트 추가 |
| 리팩토링 | 기존 테스트 통과 |

---

> 컨벤션 상세 → [conventions/](../../conventions/)
> 보안 체크 → [21-SECURITY-CONVENTIONS.md](../../conventions/21-SECURITY-CONVENTIONS.md)
