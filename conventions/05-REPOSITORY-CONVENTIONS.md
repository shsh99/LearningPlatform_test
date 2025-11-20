# 05. Repository Conventions

> 📌 **먼저 읽기**: [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)

**목적**: 데이터 접근, 쿼리 정의, 영속성 관리

---

## 1. 기본 템플릿

```java
public interface {Domain}Repository extends JpaRepository<{Domain}, Long> {

    // ===== Query Methods =====
    Optional<{Domain}> findByField1(String field1);
    List<{Domain}> findByOwnerIdAndStatus(Long ownerId, {Status}Enum status);
    Page<{Domain}> findByOwnerId(Long ownerId, Pageable pageable);

    boolean existsByField1(String field1);
    long countByOwnerId(Long ownerId);

    // ===== @Query (JPQL) =====
    @Query("SELECT d FROM {Domain} d JOIN FETCH d.parent WHERE d.id = :id")
    Optional<{Domain}> findByIdWithParent(@Param("id") Long id);

    @Query("""
        SELECT new com.company.project.domain.{domain}.dto.{Domain}Summary(
            d.id, d.field1, d.status
        )
        FROM {Domain} d
        WHERE d.ownerId = :ownerId
        """)
    List<{Domain}Summary> findSummariesByOwnerId(@Param("ownerId") Long ownerId);

    // ===== Update/Delete =====
    @Modifying
    @Query("UPDATE {Domain} d SET d.status = :status WHERE d.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") {Status}Enum status);
}
```

---

## 2. Query Method 네이밍

```java
// ✅ 조회
findByField1()
findByField1AndField2()
findByField1OrField2()
findByField1Containing()
findByCreatedAtAfter()
findByCreatedAtBetween()
findByIdIn()

// ✅ 존재 확인
existsByField1()
existsByField1AndOwnerId()

// ✅ 개수
countByOwnerId()
countByStatus()

// ✅ 삭제
deleteByOwnerId()

// ✅ Top/First
findFirstByOwnerIdOrderByCreatedAtDesc()
findTop10ByStatusOrderByCreatedAtDesc()
```

---

## 3. Pagination

```java
// ✅ Page (총 개수 포함)
Page<{Domain}> findByOwnerId(Long ownerId, Pageable pageable);

// ✅ Slice (총 개수 미포함, 더보기용)
Slice<{Domain}> findByOwnerId(Long ownerId, Pageable pageable);

// 사용
Pageable pageable = PageRequest.of(0, 20, Sort.by("createdAt").descending());
Page<{Domain}> page = repository.findByOwnerId(ownerId, pageable);
```

---

## 4. @Query (JPQL)

### 기본 JPQL

```java
@Query("SELECT d FROM {Domain} d WHERE d.field1 = :field1")
List<{Domain}> findByField1(@Param("field1") String field1);

@Query("""
    SELECT d FROM {Domain} d
    WHERE d.field1 = :field1
    AND d.status = :status
    """)
List<{Domain}> findByField1AndStatus(
    @Param("field1") String field1,
    @Param("status") {Status}Enum status
);
```

### Fetch Join (N+1 해결)

```java
// ✅ Fetch Join
@Query("SELECT d FROM {Domain} d JOIN FETCH d.parent WHERE d.id = :id")
Optional<{Domain}> findByIdWithParent(@Param("id") Long id);

// ✅ 여러 관계
@Query("""
    SELECT DISTINCT d FROM {Domain} d
    JOIN FETCH d.parent
    LEFT JOIN FETCH d.children
    WHERE d.ownerId = :ownerId
    """)
List<{Domain}> findByOwnerIdWithAll(@Param("ownerId") Long ownerId);
```

### DTO Projection

```java
@Query("""
    SELECT new com.company.project.domain.{domain}.dto.{Domain}Summary(
        d.id, d.field1, d.status
    )
    FROM {Domain} d
    WHERE d.ownerId = :ownerId
    """)
List<{Domain}Summary> findSummariesByOwnerId(@Param("ownerId") Long ownerId);
```

### Update/Delete

```java
@Modifying
@Query("UPDATE {Domain} d SET d.status = :status WHERE d.id = :id")
int updateStatus(@Param("id") Long id, @Param("status") {Status}Enum status);

@Modifying
@Query("DELETE FROM {Domain} d WHERE d.status = :status")
int deleteByStatus(@Param("status") {Status}Enum status);

// ⚠️ Service에서 @Transactional 필요
```

---

## 5. Native Query

```java
// ✅ 기본 Native Query
@Query(value = "SELECT * FROM domains WHERE field1 = :field1", nativeQuery = true)
List<{Domain}> findByField1Native(@Param("field1") String field1);

// ✅ Pagination (countQuery 필수)
@Query(
    value = "SELECT * FROM domains WHERE owner_id = :ownerId",
    countQuery = "SELECT COUNT(*) FROM domains WHERE owner_id = :ownerId",
    nativeQuery = true
)
Page<{Domain}> findByOwnerIdNative(@Param("ownerId") Long ownerId, Pageable pageable);
```

**Native Query 사용 시기**:
- Database 특화 기능 필요 (Window Function 등)
- 복잡한 쿼리로 JPQL 한계
- 가능하면 JPQL 우선 사용

---

## 6. Custom Repository (QueryDSL)

### Interface 정의

```java
public interface {Domain}RepositoryCustom {
    List<{Domain}> findByComplexCondition({Domain}SearchCondition condition);
    Page<{Domain}> searchWithDynamicQuery({Domain}SearchCondition condition, Pageable pageable);
}
```

### 구현체

```java
@RequiredArgsConstructor
public class {Domain}RepositoryImpl implements {Domain}RepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<{Domain}> findByComplexCondition({Domain}SearchCondition condition) {
        return queryFactory
            .selectFrom({domain})
            .where(
                field1Eq(condition.getField1()),
                statusIn(condition.getStatuses())
            )
            .orderBy({domain}.createdAt.desc())
            .fetch();
    }

    private BooleanExpression field1Eq(String field1) {
        return hasText(field1) ? {domain}.field1.eq(field1) : null;
    }

    private BooleanExpression statusIn(List<{Status}Enum> statuses) {
        return !isEmpty(statuses) ? {domain}.status.in(statuses) : null;
    }
}
```

### 메인 Repository에서 상속

```java
public interface {Domain}Repository
    extends JpaRepository<{Domain}, Long>, {Domain}RepositoryCustom {

    // Query Methods + Custom 메서드 모두 사용 가능
}
```

---

## 7. 자주 하는 실수

```java
// ❌ 너무 복잡한 Query Method (@Query 사용)
findByField1AndField2AndField3AndField4...

// ❌ N+1 문제 무시 (Fetch Join 필요)
@Query("SELECT d FROM Domain d WHERE d.ownerId = :id")

// ❌ @Modifying 없이 UPDATE/DELETE
@Query("UPDATE Domain d SET d.status = :status")

// ❌ Native Query countQuery 누락 (페이징 시)
@Query(value = "SELECT * FROM domains", nativeQuery = true)
Page<Domain> find(Pageable p);

// ❌ Optional 남용 (List는 불필요)
List<Optional<Domain>> findByOwnerId(Long id);
```

---

## 체크리스트

- [ ] JpaRepository 상속
- [ ] Query Method 우선 사용
- [ ] 복잡한 쿼리는 @Query (JPQL)
- [ ] Fetch Join으로 N+1 해결
- [ ] Pagination 지원 (Page/Slice)
- [ ] @Modifying + @Transactional (Update/Delete)
- [ ] Native Query는 최소화
- [ ] Custom Repository 분리 (복잡한 경우)
