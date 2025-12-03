# PRD: 차수 변경/삭제 요청 시스템 (TS-015~017)

> 📋 강사가 담당 차수의 정보 변경/삭제를 요청하고, Admin이 승인/반려하는 워크플로우

---

## 1. 요구사항 (Requirements)

### 배경 (Background)
- 현재 차수 수정/삭제는 Admin만 가능
- 강사가 본인 담당 차수 정보를 변경하고 싶을 때 직접 요청할 수 있는 채널 필요
- 요청 → 승인 워크플로우로 관리자 검토 후 반영

### 목표 (Goals)
- [x] 강사가 차수 정보 변경 요청 제출 (TS-015)
- [x] 강사가 차수 삭제 요청 제출 (TS-016)
- [x] Admin이 요청 목록 조회 및 승인/반려 처리 (TS-017)

### 비목표 (Non-Goals)
- 강사가 직접 차수를 수정/삭제하는 기능 (승인 없이)
- 실시간 알림 (향후 NOTI 모듈에서 구현)
- 강의 개설 신청 (SIS 모듈에서 이미 구현됨)

---

## 2. 우선순위 (MoSCoW)

### Must-have (필수)
- [x] 변경 요청 생성 API (TS-015-1)
- [x] 삭제 요청 생성 API (TS-016-1)
- [x] 삭제 요청 시 수강생 검증 (TS-016-2)
- [x] 요청 승인/반려 API (TS-015-3, TS-016-3)
- [x] Admin 요청 목록 조회 API (TS-017-1)

### Should-have (권장)
- [x] 변경 요청 시 영향도 정보 포함 (TS-015-2)
- [x] 요청 취소 기능 (TS-015-4, TS-016-4)
- [x] 유형별 필터 (TS-017-2)

### Could-have (선택)
- [ ] 승인/반려 사유 입력
- [ ] 요청 이력 조회

### Won't-have (제외)
- 강사 직접 수정 (승인 없이)
- 알림 발송 (별도 모듈)

---

## 3. 사용자 경험 (UX)

### 사용자 스토리

**변경 요청 (TS-015)**
```
AS A 강사
I WANT 내 담당 차수의 시간/장소/기간 변경을 요청하고 싶다
SO THAT 관리자 승인 후 일정이 변경된다
```

**삭제 요청 (TS-016)**
```
AS A 강사
I WANT 내 담당 차수를 삭제 요청하고 싶다
SO THAT 불필요한 차수가 정리된다
```

**요청 관리 (TS-017)**
```
AS A Admin/Operator
I WANT 대기 중인 변경/삭제 요청을 확인하고 처리하고 싶다
SO THAT 요청을 검토 후 승인/반려할 수 있다
```

### 화면 흐름

**강사 - 변경 요청**
1. 내 강의 목록에서 차수 선택
2. "정보 변경 요청" 버튼 클릭
3. 변경할 필드 수정 (시작일, 종료일, 요일, 시간, 정원)
4. 변경 사유 입력
5. 요청 제출 → PENDING 상태로 저장

**강사 - 삭제 요청**
1. 내 강의 목록에서 차수 선택
2. "삭제 요청" 버튼 클릭
3. 수강생 있으면 → 에러 메시지 "수강생이 있어 삭제 요청 불가"
4. 삭제 사유 입력 (필수)
5. 요청 제출 → PENDING 상태로 저장

**Admin - 요청 처리**
1. 차수 요청 관리 페이지 접근
2. PENDING 상태 요청 목록 확인
3. 요청 상세 보기 (before/after 비교)
4. 승인 또는 반려 클릭
5. (선택) 반려 시 사유 입력

---

## 4. 기술 설계 (Technical Design)

### 의존성 (Dependencies)
- 기존 모듈: `domain/timeschedule` (CourseTerm, InstructorAssignment)
- 기존 모듈: `domain/user` (User)
- 참조 패턴: `domain/courseapplication` (Request/Approval 패턴)

### 데이터 모델

**Entity 1: CourseTermChangeRequest**
```java
Entity: CourseTermChangeRequest
- id: Long (PK)
- tenantId: Long (테넌트 격리)
- courseTerm: CourseTerm (대상 차수)
- requester: User (요청자 - 강사)
- status: TermRequestStatus (PENDING/APPROVED/REJECTED/CANCELLED)

// Before 스냅샷 (요청 시점 데이터)
- beforeStartDate: LocalDate
- beforeEndDate: LocalDate
- beforeDaysOfWeek: String (JSON)
- beforeStartTime: LocalTime
- beforeEndTime: LocalTime
- beforeMaxStudents: Integer

// After 스냅샷 (변경 요청 데이터)
- afterStartDate: LocalDate
- afterEndDate: LocalDate
- afterDaysOfWeek: String (JSON)
- afterStartTime: LocalTime
- afterEndTime: LocalTime
- afterMaxStudents: Integer

// 메타 정보
- reason: String (요청 사유)
- affectedStudentCount: Integer (영향 받는 수강생 수)
- rejectionReason: String (반려 사유)
- processedBy: User (처리자)
- processedAt: LocalDateTime (처리 시간)
```

**Entity 2: CourseTermDeleteRequest**
```java
Entity: CourseTermDeleteRequest
- id: Long (PK)
- tenantId: Long (테넌트 격리)
- courseTerm: CourseTerm (대상 차수)
- requester: User (요청자 - 강사)
- status: TermRequestStatus (PENDING/APPROVED/REJECTED/CANCELLED)
- reason: String (삭제 사유 - 필수)
- rejectionReason: String (반려 사유)
- processedBy: User (처리자)
- processedAt: LocalDateTime (처리 시간)
```

**Enum: TermRequestStatus**
```java
public enum TermRequestStatus {
    PENDING,    // 대기 중
    APPROVED,   // 승인됨
    REJECTED,   // 반려됨
    CANCELLED   // 취소됨 (요청자가 취소)
}
```

### API 설계

**변경 요청 (TS-015)**
```
POST /api/course-term-requests/change
Request: CreateChangeRequestDto {
    courseTermId: Long,
    startDate: LocalDate,
    endDate: LocalDate,
    daysOfWeek: Set<DayOfWeek>,
    startTime: LocalTime,
    endTime: LocalTime,
    maxStudents: Integer,
    reason: String
}
Response: ChangeRequestResponse { id, status, ... }

GET /api/course-term-requests/change/my
Response: List<ChangeRequestResponse>

DELETE /api/course-term-requests/change/{id}
Response: void (PENDING만 취소 가능)
```

**삭제 요청 (TS-016)**
```
POST /api/course-term-requests/delete
Request: CreateDeleteRequestDto {
    courseTermId: Long,
    reason: String (필수)
}
Response: DeleteRequestResponse { id, status, ... }
→ 수강생 있으면 400 Bad Request

GET /api/course-term-requests/delete/my
Response: List<DeleteRequestResponse>

DELETE /api/course-term-requests/delete/{id}
Response: void (PENDING만 취소 가능)
```

**Admin 요청 관리 (TS-017)**
```
GET /api/course-term-requests?status=PENDING&type=CHANGE|DELETE
Response: List<TermRequestResponse> (변경+삭제 통합)

GET /api/course-term-requests/change/{id}
Response: ChangeRequestDetailResponse (before/after 포함)

GET /api/course-term-requests/delete/{id}
Response: DeleteRequestDetailResponse

PATCH /api/course-term-requests/change/{id}/approve
Response: ChangeRequestResponse (CourseTerm 실제 수정됨)

PATCH /api/course-term-requests/change/{id}/reject
Request: { rejectionReason: String }
Response: ChangeRequestResponse

PATCH /api/course-term-requests/delete/{id}/approve
Response: DeleteRequestResponse (CourseTerm Soft Delete)

PATCH /api/course-term-requests/delete/{id}/reject
Request: { rejectionReason: String }
Response: DeleteRequestResponse
```

### 영향 범위
- [x] Backend 변경 필요 (Entity, Repository, Service, Controller)
- [x] Frontend 변경 필요 (요청 폼, 관리 페이지)
- [x] DB 마이그레이션 필요 (새 테이블 2개)

---

## 5. 구현 계획 (Implementation Plan)

### 작업 분해 (Work Breakdown)

| 순서 | 작업 | 레이어 | 예상 복잡도 |
|------|------|--------|-------------|
| 1 | TermRequestStatus Enum 생성 | Backend | Low |
| 2 | CourseTermChangeRequest Entity 생성 | Backend | Medium |
| 3 | CourseTermDeleteRequest Entity 생성 | Backend | Medium |
| 4 | Repository 생성 (2개) | Backend | Low |
| 5 | DTO 생성 (Request/Response) | Backend | Medium |
| 6 | CourseTermRequestService 구현 | Backend | High |
| 7 | CourseTermRequestController 구현 | Backend | Medium |
| 8 | Frontend Types 정의 | Frontend | Low |
| 9 | Frontend API Service 구현 | Frontend | Medium |
| 10 | 강사용 요청 폼 컴포넌트 | Frontend | Medium |
| 11 | Admin 요청 관리 페이지 | Frontend | High |

### 참조할 컨벤션
- `conventions/06-ENTITY-CONVENTIONS.md` - Entity 작성
- `conventions/05-REPOSITORY-CONVENTIONS.md` - Repository 작성
- `conventions/07-DTO-CONVENTIONS.md` - DTO 작성
- `conventions/04-SERVICE-CONVENTIONS.md` - Service 작성
- `conventions/03-CONTROLLER-CONVENTIONS.md` - Controller 작성
- `conventions/12-REACT-COMPONENT-CONVENTIONS.md` - 컴포넌트 작성

---

## 6. 리스크 분석 (Risk Analysis)

### 기술 리스크
| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| N+1 쿼리 (CourseTerm, User 조회) | Medium | Fetch Join 사용 |
| 동시성 (같은 차수에 중복 요청) | Low | PENDING 상태 요청 존재 시 새 요청 거부 |
| 승인 후 데이터 불일치 | Medium | 트랜잭션 내에서 CourseTerm 수정 |

### 비즈니스 리스크
| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 삭제 후 복구 불가 | High | Soft Delete 적용 (deletedAt) |
| 수강생 일정 변경 영향 | Medium | 영향 수강생 수 표시 (Admin 판단) |

---

## 7. 테스트 계획 (Test Plan)

### 단위 테스트
- [ ] CourseTermRequestServiceTest
  - 변경 요청 생성 성공
  - 삭제 요청 생성 성공
  - 삭제 요청 시 수강생 있으면 실패
  - 승인 시 CourseTerm 수정 확인
  - PENDING 아닌 요청 취소 시 실패

### 통합 테스트
- [ ] CourseTermRequestControllerTest
  - API 엔드포인트 검증
  - 권한 검증 (강사/Admin)

### E2E 테스트
- [ ] 강사가 변경 요청 제출 → Admin 승인 → 차수 정보 변경됨
- [ ] 강사가 삭제 요청 제출 → Admin 승인 → 차수 삭제됨

---

## 8. 체크리스트 (Checklist)

### 구현 전
- [x] PRD 리뷰 완료
- [x] 기술 설계 확정
- [x] 의존성 확인 (CourseTerm, User, CourseApplication 패턴)

### 구현 중
- [ ] 컨벤션 준수
- [ ] 테스트 작성
- [ ] 코드 리뷰

### 구현 후
- [ ] 모든 테스트 통과
- [ ] BACKLOG.md 상태 업데이트
- [ ] PR 생성

---

## 9. 결정 기록 (Decisions)

| 날짜 | 결정 | 이유 | 대안 |
|------|------|------|------|
| 2025-12-03 | 변경 요청은 수강생 있어도 허용 (Option B) | 관리자가 영향도 보고 판단 | 수강생 있으면 요청 차단 |
| 2025-12-03 | 삭제 요청은 수강생 있으면 차단 | 삭제는 복구 불가능 | 관리자 판단에 위임 |
| 2025-12-03 | TS-017 신규로 생성 (TS-018/019 삭제) | 변경/삭제 통합 관리 | 기존 TS-018/019 유지 |
| 2025-12-03 | before/after 스냅샷 저장 | 승인 시점에 원본 데이터 변경 가능성 | 요청 시점 diff만 저장 |

---

## 10. 참고 자료 (References)

- 관련 계획: [composed-sleeping-cocke.md](composed-sleeping-cocke.md)
- 참조 패턴: CourseApplication (domain/courseapplication)
- 기존 엔티티: CourseTerm, InstructorAssignment
