# 22. Performance Conventions

> 성능 최적화 규칙 및 패턴
> **핵심**: N+1 방지, 캐싱, 불필요한 연산 제거

---

## 빠른 탐색

| 섹션 | 내용 |
|------|------|
| [핵심 규칙](#핵심-규칙) | 5가지 성능 원칙 |
| [Backend 성능](#backend-성능) | N+1, 페이징, 캐싱, 비동기 |
| [Frontend 성능](#frontend-성능) | 리렌더링, React Query, 코드 스플리팅 |
| [데이터베이스](#데이터베이스-성능) | 인덱스, 쿼리 분석 |
| [체크리스트](#체크리스트) | Backend/Frontend/측정 |
| [측정 도구](#성능-측정-도구) | Actuator, DevTools, Lighthouse |

---

## 핵심 규칙

```
✅ N+1 쿼리 → Fetch Join 또는 @EntityGraph
✅ 대량 데이터 → 페이지네이션 필수
✅ 반복 조회 → 캐싱 적용
✅ React → 불필요한 리렌더링 방지
✅ 번들 → 코드 스플리팅, Lazy Loading
```

---

## Backend 성능

### N+1 쿼리 해결

```java
// ❌ Bad: N+1 발생
List<Course> courses = courseRepository.findAll();
for (Course course : courses) {
    course.getInstructor().getName(); // 추가 쿼리 N번
}

// ✅ Good: Fetch Join
@Query("SELECT c FROM Course c JOIN FETCH c.instructor")
List<Course> findAllWithInstructor();

// ✅ Good: @EntityGraph
@EntityGraph(attributePaths = {"instructor"})
List<Course> findAll();

// ✅ Good: Batch Size (application.yml)
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 100
```

### 페이지네이션

```java
// ✅ Good: Pageable 사용
@GetMapping("/courses")
public Page<CourseResponse> getCourses(
    @PageableDefault(size = 20, sort = "createdAt", direction = DESC) Pageable pageable
) {
    return courseService.findAll(pageable);
}

// Repository
Page<Course> findByStatus(CourseStatus status, Pageable pageable);
```

### 쿼리 최적화

```java
// ❌ Bad: 전체 Entity 조회
List<Course> courses = courseRepository.findAll();
return courses.stream()
    .map(c -> c.getTitle())
    .toList();

// ✅ Good: 필요한 필드만 조회 (Projection)
@Query("SELECT c.id, c.title FROM Course c")
List<Object[]> findAllTitles();

// ✅ Good: DTO Projection
@Query("SELECT new com.example.dto.CourseSimple(c.id, c.title) FROM Course c")
List<CourseSimple> findAllSimple();
```

### 캐싱

```java
// ✅ Good: 자주 조회되는 데이터 캐싱
@Cacheable(value = "courses", key = "#id")
public CourseResponse getCourse(Long id) {
    return courseRepository.findById(id)
        .map(CourseResponse::from)
        .orElseThrow();
}

@CacheEvict(value = "courses", key = "#id")
public void updateCourse(Long id, UpdateCourseRequest request) {
    // 업데이트 로직
}

// application.yml
spring:
  cache:
    type: redis  # 또는 caffeine
```

### 비동기 처리

```java
// ✅ Good: 무거운 작업 비동기 처리
@Async
public CompletableFuture<Void> sendNotificationEmail(Long userId) {
    // 이메일 발송 (응답 대기 불필요)
}

// Config
@EnableAsync
@Configuration
public class AsyncConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        return executor;
    }
}
```

---

## Frontend 성능

### 불필요한 리렌더링 방지

```tsx
// ❌ Bad: 매 렌더링마다 새 객체
<Child options={{ enabled: true }} />

// ✅ Good: useMemo로 메모이제이션
const options = useMemo(() => ({ enabled: true }), []);
<Child options={options} />

// ✅ Good: useCallback으로 함수 메모이제이션
const handleClick = useCallback(() => {
  console.log(id);
}, [id]);
```

### React Query 캐싱

```tsx
// ✅ Good: 적절한 캐시 설정
const { data } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses,
  staleTime: 5 * 60 * 1000,      // 5분간 fresh
  gcTime: 30 * 60 * 1000,        // 30분간 캐시 유지
  refetchOnWindowFocus: false,   // 포커스 시 재요청 비활성화
});

// ✅ Good: 조건부 쿼리
const { data } = useQuery({
  queryKey: ['course', courseId],
  queryFn: () => fetchCourse(courseId),
  enabled: !!courseId,  // courseId 있을 때만 실행
});
```

### 코드 스플리팅

```tsx
// ✅ Good: Lazy Loading
import { lazy, Suspense } from 'react';

const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 이미지 최적화

```tsx
// ✅ Good: Lazy Loading
<img src={imageUrl} loading="lazy" alt="..." />

// ✅ Good: 적절한 크기
<img
  src={imageUrl}
  srcSet={`${imageUrl}?w=300 300w, ${imageUrl}?w=600 600w`}
  sizes="(max-width: 600px) 300px, 600px"
  alt="..."
/>
```

### 리스트 최적화

```tsx
// ✅ Good: key 속성
{items.map((item) => (
  <Item key={item.id} item={item} />
))}

// ✅ Good: 가상화 (대량 데이터)
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  // ...
}
```

---

## 데이터베이스 성능

### 인덱스

```sql
-- ✅ Good: 자주 조회되는 컬럼
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_course_status ON courses(status);
CREATE INDEX idx_enrollment_user_course ON enrollments(user_id, course_id);
```

### 쿼리 분석

```sql
-- 실행 계획 확인
EXPLAIN SELECT * FROM courses WHERE status = 'PUBLISHED';

-- 슬로우 쿼리 로그 활성화 (MySQL)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

---

## 체크리스트

### Backend
- [ ] N+1 쿼리 없음 (Fetch Join / EntityGraph)
- [ ] 대량 조회에 페이지네이션 적용
- [ ] 자주 조회되는 데이터 캐싱
- [ ] 필요한 필드만 조회 (Projection)
- [ ] 적절한 인덱스 설정

### Frontend
- [ ] 불필요한 리렌더링 없음 (memo, useMemo, useCallback)
- [ ] React Query 캐시 설정
- [ ] 코드 스플리팅 적용
- [ ] 이미지 lazy loading
- [ ] 대량 리스트 가상화

### 측정
- [ ] API 응답 시간 < 200ms (목표)
- [ ] 페이지 로드 < 3초 (LCP)
- [ ] Lighthouse 성능 점수 > 80

---

## 성능 측정 도구

| 도구 | 용도 |
|------|------|
| Spring Boot Actuator | API 메트릭 |
| Hibernate Statistics | 쿼리 분석 |
| Chrome DevTools | 네트워크, 렌더링 |
| React DevTools Profiler | 컴포넌트 렌더링 |
| Lighthouse | 웹 성능 전반 |

---

> 쿼리 최적화 상세 → [05-REPOSITORY-CONVENTIONS.md](./05-REPOSITORY-CONVENTIONS.md)
> React 최적화 → [12-REACT-COMPONENT-CONVENTIONS.md](./12-REACT-COMPONENT-CONVENTIONS.md)
