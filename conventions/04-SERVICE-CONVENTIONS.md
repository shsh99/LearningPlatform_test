# 04. Service Conventions

> 📌 **먼저 읽기**: [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md)

**목적**: Business Logic, Transaction 관리, Entity ↔ DTO 변환 조율

---

## 1. 기본 템플릿

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // ✅ 클래스 레벨: 기본 읽기 전용
@Slf4j
public class {Domain}ServiceImpl implements {Domain}Service {

    private final {Domain}Repository {domain}Repository;

    // ===== 조회 (클래스 레벨 readOnly=true 적용됨) =====
    public {Domain}Response findById(Long id) {
        log.debug("Finding {domain}: id={}", id);

        {Domain} entity = {domain}Repository.findById(id)
            .orElseThrow(() -> new {Domain}NotFoundException(id));

        return {Domain}Response.from(entity);
    }

    // ===== 생성 (@Transactional) =====
    @Transactional
    public {Domain}Response create(Create{Domain}Request request) {
        log.info("Creating {domain}: field1={}", request.field1());

        // 1. Validation
        validate{Domain}Creation(request);

        // 2. Entity 생성 및 저장
        {Domain} entity = {Domain}.create(request.field1(), request.field2());
        {Domain} savedEntity = {domain}Repository.save(entity);

        log.info("{Domain} created: id={}", savedEntity.getId());

        // 3. DTO 변환
        return {Domain}Response.from(savedEntity);
    }

    private void validate{Domain}Creation(Create{Domain}Request request) {
        if ({domain}Repository.existsByField1(request.field1())) {
            throw new Duplicate{Domain}Exception("이미 존재하는 데이터입니다");
        }
    }
}
```

---

## 2. Transaction 규칙

> 자세한 내용은 [00-CONVENTIONS-CORE.md](./00-CONVENTIONS-CORE.md) 참고

```java
@Service
@Transactional(readOnly = true)  // ✅ 클래스 레벨
public class {Domain}Service {
    public {Domain}Response findById(Long id) { }  // 읽기

    @Transactional  // 쓰기
    public {Domain}Response create(Create{Domain}Request request) { }
}
```

---

## 3. Entity ↔ DTO 변환

```java
// ✅ Entity → DTO: {Domain}Response.from(entity)
return {Domain}Response.from(entity);

// ✅ DTO → Entity: {Domain}.create(...)
{Domain} entity = {Domain}.create(request.field1(), request.field2());

// ❌ new 생성자 직접 사용 금지
return new {Domain}Response(entity.getId(), ...);  // ❌
```

---

## 4. Logging 규칙

```java
@Service
@Slf4j
public class {Domain}Service {

    // INFO: 주요 비즈니스 이벤트
    log.info("Creating {domain}: field1={}", request.field1());
    log.info("{Domain} created: id={}", savedEntity.getId());

    // DEBUG: 상세 정보
    log.debug("Finding {domain}: id={}", id);
    log.debug("Query result: count={}", result.size());

    // ERROR: 예외 발생
    log.error("Failed to process: id={}", id, e);
}
```

---

## 5. 예외 처리

```java
// ✅ GOOD: 예외는 던지기만 (클래스 레벨 readOnly=true 적용됨)
public {Domain}Response findById(Long id) {
    {Domain} entity = {domain}Repository.findById(id)
        .orElseThrow(() -> new {Domain}NotFoundException(id));

    return {Domain}Response.from(entity);
    // GlobalExceptionHandler가 처리
}

// ❌ BAD: Service에서 try-catch
public {Domain}Response findById(Long id) {
    try {  // ❌ 불필요
        {Domain} entity = {domain}Repository.findById(id)
            .orElseThrow(() -> new {Domain}NotFoundException(id));
        return {Domain}Response.from(entity);
    } catch ({Domain}NotFoundException e) {
        log.error("Not found: id={}", id);
        throw e;  // 그냥 다시 던지기만
    }
}
```

---

## 6. 자주 하는 실수

```java
// ❌ 1. 쓰기 작업에 @Transactional 누락
public {Domain}Response create(Create{Domain}Request request) {  // ❌ readOnly=true 적용됨
}

// ❌ 2. create에 save() 누락
@Transactional
public {Domain}Response create(Create{Domain}Request request) {
    {Domain} entity = {Domain}.create(request.field1(), request.field2());
    // ❌ save() 필요! 변경 감지는 update만
    return {Domain}Response.from(entity);
}

// ❌ 3. new 생성자로 DTO 직접 생성
return new {Domain}Response(entity.getId(), ...);  // ❌ from() 사용

// ❌ 4. Service에서 try-catch 남용
@Transactional
public {Domain}Response create(Create{Domain}Request request) {
    try {  // ❌ 불필요
        // ... 비즈니스 로직 ...
    } catch (Exception e) {
        throw e;  // 그냥 다시 던지기만
    }
}
```

