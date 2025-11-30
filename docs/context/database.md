# Database Context

> AI가 DB 관련 작업 시 참조하는 상세 스키마 정보

---

## ERD 개요

```
User (1) ──── (N) Enrollment (N) ──── (1) CourseTerm
                                           │
                                           │ (N)
                                           │
                                      Course (1)
```

---

## 테이블 상세

### users
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 사용자 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 (로그인 ID) |
| password | VARCHAR(255) | NOT NULL | BCrypt 암호화 |
| name | VARCHAR(100) | NOT NULL | 이름 |
| role | VARCHAR(20) | NOT NULL | ADMIN/OPERATOR/INSTRUCTOR/STUDENT/USER |
| status | VARCHAR(20) | NOT NULL | ACTIVE/INACTIVE/SUSPENDED |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### courses
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 강의 ID |
| title | VARCHAR(255) | NOT NULL | 강의명 |
| description | TEXT | | 강의 설명 |
| category | VARCHAR(50) | | 카테고리 |
| instructor_id | BIGINT | FK (users) | 강사 ID |
| status | VARCHAR(20) | NOT NULL | DRAFT/PUBLISHED/CLOSED/ARCHIVED |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### course_terms
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 차수 ID |
| course_id | BIGINT | FK (courses) | 강의 ID |
| term_number | INT | NOT NULL | 차수 번호 |
| start_date | DATE | NOT NULL | 시작일 |
| end_date | DATE | NOT NULL | 종료일 |
| capacity | INT | NOT NULL | 정원 |
| enrolled_count | INT | DEFAULT 0 | 등록 인원 |
| status | VARCHAR(20) | NOT NULL | SCHEDULED/ONGOING/COMPLETED/CANCELLED |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### enrollments
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO | 수강신청 ID |
| user_id | BIGINT | FK (users) | 사용자 ID |
| course_term_id | BIGINT | FK (course_terms) | 차수 ID |
| status | VARCHAR(20) | NOT NULL | PENDING/APPROVED/REJECTED/CANCELLED |
| applied_at | TIMESTAMP | NOT NULL | 신청일시 |
| processed_at | TIMESTAMP | | 처리일시 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

---

## Enum 값 정의

### UserRole
```java
ADMIN       // 시스템 관리자
OPERATOR    // 운영자
INSTRUCTOR  // 강사
STUDENT     // 수강생
USER        // 일반 사용자
```

### UserStatus
```java
ACTIVE      // 활성
INACTIVE    // 비활성
SUSPENDED   // 정지
```

### CourseStatus
```java
DRAFT       // 초안 (작성 중)
PUBLISHED   // 공개 (수강 신청 가능)
CLOSED      // 마감 (신청 마감)
ARCHIVED    // 보관 (종료/비공개)
```

### TermStatus
```java
SCHEDULED   // 예정
ONGOING     // 진행중
COMPLETED   // 완료
CANCELLED   // 취소
```

### EnrollmentStatus
```java
PENDING     // 대기중
APPROVED    // 승인
REJECTED    // 거절
CANCELLED   // 취소
```

---

## 인덱스 권장사항

```sql
-- 자주 조회되는 컬럼
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_course_terms_course_id ON course_terms(course_id);
CREATE INDEX idx_course_terms_status ON course_terms(status);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_term_id ON enrollments(course_term_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

---

## N+1 쿼리 주의사항

### 문제 발생 케이스
```java
// ❌ N+1 발생
List<CourseTerm> terms = courseTermRepository.findAll();
for (CourseTerm term : terms) {
    term.getCourse().getTitle(); // 매번 쿼리 발생
}
```

### 해결 방법
```java
// ✅ Fetch Join 사용
@Query("SELECT ct FROM CourseTerm ct JOIN FETCH ct.course")
List<CourseTerm> findAllWithCourse();

// ✅ EntityGraph 사용
@EntityGraph(attributePaths = {"course"})
List<CourseTerm> findByStatus(TermStatus status);
```
