# 06. Entity Conventions

> 📌 **먼저 읽기**: [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)

**목적**: 도메인 모델, 비즈니스 로직, 데이터베이스 매핑

---

## ⛔ 가장 중요한 규칙: Setter 절대 금지!

```java
// ❌ 절대 금지!
public void setName(String name) { this.name = name; }

// ✅ 비즈니스 메서드 사용
public void updateName(String newName) {
    validateName(newName);
    this.name = newName;
}
```

---

## 1. 기본 템플릿

```java
@Entity
@Table(name = "{table_name}")
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // ✅ Protected
@Getter  // ⛔ Setter 금지!
public class {Domain} extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String field1;

    @Enumerated(EnumType.STRING)  // ✅ 항상 STRING
    @Column(nullable = false)
    private {Status}Enum status;

    // ===== 정적 팩토리 메서드 =====
    public static {Domain} create(String field1) {
        {Domain} entity = new {Domain}();
        entity.field1 = field1;
        entity.status = {Status}Enum.ACTIVE;
        return entity;
    }

    // ===== 비즈니스 메서드 =====
    public void updateField1(String newField1) {
        validateField1(newField1);
        this.field1 = newField1;
    }

    public void activate() {
        if (this.status == {Status}Enum.ACTIVE) {
            throw new BusinessException("이미 활성화된 상태입니다");
        }
        this.status = {Status}Enum.ACTIVE;
    }

    // ===== Private 검증 메서드 =====
    private void validateField1(String field1) {
        if (field1 == null || field1.isBlank()) {
            throw new IllegalArgumentException("field1은 필수입니다");
        }
    }
}
```

---

## 2. 연관관계 매핑

### @ManyToOne (다대일)

```java
@Entity
@Getter
public class ChildEntity {

    @ManyToOne(fetch = FetchType.LAZY)  // ✅ 항상 LAZY
    @JoinColumn(name = "parent_id")
    private ParentEntity parent;

    void assignParent(ParentEntity parent) {
        this.parent = parent;
    }
}

@Entity
@Getter
public class ParentEntity {

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<ChildEntity> children = new ArrayList<>();

    // ✅ 연관관계 편의 메서드
    public void addChild(ChildEntity child) {
        this.children.add(child);
        child.assignParent(this);  // 양방향 동기화
    }
}
```

---

## 3. Column 매핑

```java
@Entity
public class {Domain} {

    // ✅ String
    @Column(nullable = false, length = 100)
    private String field1;

    // ✅ Enum (항상 STRING)
    @Enumerated(EnumType.STRING)  // ⛔ ORDINAL 금지
    @Column(nullable = false)
    private {Status}Enum status;

    // ✅ 날짜/시간 (LocalDateTime)
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // ❌ BAD: Date, Timestamp 사용 금지
    private Date createdDate;  // ❌
}
```

---

## 4. BaseEntity 패턴

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

---

## 5. Entity 생성 패턴

### 정적 팩토리 메서드 (권장)

```java
public static {Domain} create(String field1, String field2) {
    {Domain} entity = new {Domain}();
    entity.field1 = field1;
    entity.field2 = field2;
    entity.status = {Status}Enum.ACTIVE;
    return entity;
}
```

### Builder (복잡한 경우)

```java
@Builder
private {Domain}(String field1, String field2, String field3) {
    this.field1 = field1;
    this.field2 = field2;
    this.field3 = field3;
    this.status = {Status}Enum.ACTIVE;
}

// 사용
{Domain} entity = {Domain}.builder()
    .field1("value1")
    .field2("value2")
    .build();
```

---

## 6. 자주 하는 실수

```java
// ❌ 1. Setter 사용
public void setName(String name) { }  // ⛔ 절대 금지!

// ❌ 2. Enum ORDINAL 사용
@Enumerated(EnumType.ORDINAL)  // ❌ STRING 사용
private {Status}Enum status;

// ❌ 3. EAGER 로딩
@ManyToOne(fetch = FetchType.EAGER)  // ❌ LAZY 사용
private ParentEntity parent;

// ❌ 4. 검증 로직 없음
public void updateTitle(String newTitle) {
    this.title = newTitle;  // ❌ 검증 없음
}
```

