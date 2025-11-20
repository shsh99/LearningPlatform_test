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

    // ===== 조회 (readOnly = true) =====
    @Transactional(readOnly = true)  // 명시적 표시 권장
    public {Domain}Response findById(Long id) {
        log.debug("Finding {domain}: id={}", id);

        {Domain} entity = {domain}Repository.findById(id)
            .orElseThrow(() -> new {Domain}NotFoundException(id));

        return {Domain}Response.from(entity);
    }

    @Transactional(readOnly = true)
    public PageResponse<{Domain}Response> findAll(Pageable pageable) {
        Page<{Domain}> entityPage = {domain}Repository.findAll(pageable);
        Page<{Domain}Response> responsePage = entityPage.map({Domain}Response::from);
        return PageResponse.from(responsePage);
    }

    // ===== 생성/수정/삭제 (@Transactional) =====
    @Transactional
    public {Domain}Response create(Create{Domain}Request request) {
        log.info("Creating {domain}: field1={}", request.field1());

        // 1. Validation
        validate{Domain}Creation(request);

        // 2. Entity 생성
        {Domain} entity = {Domain}.create(
            request.field1(),
            request.field2()
        );

        // 3. 저장
        {Domain} savedEntity = {domain}Repository.save(entity);

        log.info("{Domain} created: id={}", savedEntity.getId());

        // 4. DTO 변환
        return {Domain}Response.from(savedEntity);
    }

    @Transactional
    public {Domain}Response update(Long id, Update{Domain}Request request) {
        log.info("Updating {domain}: id={}", id);

        // 1. 조회
        {Domain} entity = {domain}Repository.findById(id)
            .orElseThrow(() -> new {Domain}NotFoundException(id));

        // 2. Entity의 비즈니스 메서드 호출
        entity.updateField1(request.field1());
        entity.updateField2(request.field2());

        // 3. 변경 감지로 자동 저장 (save 불필요)
        log.info("{Domain} updated: id={}", id);

        return {Domain}Response.from(entity);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting {domain}: id={}", id);

        {Domain} entity = {domain}Repository.findById(id)
            .orElseThrow(() -> new {Domain}NotFoundException(id));

        entity.delete();  // Soft delete

        log.info("{Domain} deleted: id={}", id);
    }

    // ===== Private Validation 메서드 =====
    private void validate{Domain}Creation(Create{Domain}Request request) {
        if ({domain}Repository.existsByField1(request.field1())) {
            throw new Duplicate{Domain}Exception("이미 존재하는 데이터입니다");
        }
    }
}
```

---

## 2. Transaction 규칙

```java
@Service
@Transactional(readOnly = true)  // ✅ 클래스 레벨: 기본 읽기 전용
public class {Domain}Service {

    // ✅ 읽기: readOnly = true (클래스 레벨 적용)
    public {Domain}Response findById(Long id) { }

    // ✅ 쓰기: @Transactional (readOnly = false)
    @Transactional
    public {Domain}Response create(Create{Domain}Request request) { }

    @Transactional
    public {Domain}Response update(Long id, Update{Domain}Request request) { }

    @Transactional
    public void delete(Long id) { }
}
```

---

## 3. Entity ↔ DTO 변환

```java
// ✅ GOOD: DTO의 정적 팩토리 메서드 사용
@Transactional(readOnly = true)
public {Domain}Response findById(Long id) {
    {Domain} entity = {domain}Repository.findById(id)
        .orElseThrow(() -> new {Domain}NotFoundException(id));

    return {Domain}Response.from(entity);  // ✅
}

// ✅ GOOD: Entity의 정적 팩토리 메서드 사용
@Transactional
public {Domain}Response create(Create{Domain}Request request) {
    {Domain} entity = {Domain}.create(  // ✅
        request.field1(),
        request.field2()
    );

    {Domain} savedEntity = {domain}Repository.save(entity);
    return {Domain}Response.from(savedEntity);
}
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
// ✅ GOOD: 예외는 던지기만
@Transactional(readOnly = true)
public {Domain}Response findById(Long id) {
    {Domain} entity = {domain}Repository.findById(id)
        .orElseThrow(() -> new {Domain}NotFoundException(id));

    return {Domain}Response.from(entity);
    // GlobalExceptionHandler가 처리
}

// ❌ BAD: Service에서 try-catch
@Transactional(readOnly = true)
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
// ❌ 1. @Transactional 누락 (쓰기 작업)
public {Domain}Response create(Create{Domain}Request request) {  // ❌
    // readOnly=true 적용됨
}

// ❌ 2. readOnly 설정 잘못 (읽기 작업)
@Transactional  // ❌ readOnly=false가 기본
public {Domain}Response findById(Long id) { }

// ❌ 3. create에 save 누락
@Transactional
public {Domain}Response create(Create{Domain}Request request) {
    {Domain} entity = {Domain}.create(request.field1(), request.field2());
    // ❌ save 필요! 변경 감지는 update만
    return {Domain}Response.from(entity);
}

// ❌ 4. Service에서 직접 DTO 생성
@Transactional(readOnly = true)
public {Domain}Response findById(Long id) {
    {Domain} entity = {domain}Repository.findById(id).orElseThrow();
    return new {Domain}Response(  // ❌ {Domain}Response.from(entity) 사용
        entity.getId(),
        entity.getField1()
    );
}

// ❌ 5. try-catch 남용
@Transactional
public {Domain}Response create(Create{Domain}Request request) {
    try {  // ❌ 불필요
        {Domain} entity = {Domain}.create(request.field1(), request.field2());
        {Domain} savedEntity = {domain}Repository.save(entity);
        return {Domain}Response.from(savedEntity);
    } catch (Exception e) {
        log.error("Failed to create", e);
        throw e;  // 그냥 다시 던지기만
    }
}
```

---

## 체크리스트

- [ ] `@Service`, `@RequiredArgsConstructor`, `@Slf4j`
- [ ] `@Transactional(readOnly = true)` 클래스 레벨
- [ ] 쓰기 작업: `@Transactional` 메서드 레벨
- [ ] Entity → DTO: `{Domain}Response.from(entity)`
- [ ] DTO → Entity: `{Domain}.create(...)` 또는 `Builder`
- [ ] Private validation 메서드 분리
- [ ] 적절한 로깅 (INFO, DEBUG)
- [ ] 예외는 던지기만 (try-catch 없음)
