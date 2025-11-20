# 01. Project Structure

**목적**: Spring Boot 3.2 + Java 17-21 프로젝트 구조 가이드

---

## 1. 전체 프로젝트 구조

```
project-name/
├── src/
│   ├── main/
│   │   ├── java/com/company/project/
│   │   │   ├── ProjectApplication.java
│   │   │   ├── domain/          # 도메인별 패키지
│   │   │   ├── common/          # 공통 컴포넌트
│   │   │   ├── config/          # 설정
│   │   │   └── security/        # 보안
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── data.sql (optional)
│   └── test/
│       └── java/com/company/project/
├── conventions/                  # 이 폴더
│   ├── 00-CONVENTIONS-CORE.md
│   ├── 01-PROJECT-STRUCTURE.md
│   ├── 03-CONTROLLER-CONVENTIONS.md
│   ├── 04-SERVICE-CONVENTIONS.md
│   ├── 05-REPOSITORY-CONVENTIONS.md
│   ├── 06-ENTITY-CONVENTIONS.md
│   ├── 07-DTO-CONVENTIONS.md
│   └── 08-EXCEPTION-CONVENTIONS.md
├── build.gradle (or pom.xml)
├── .gitignore
└── README.md
```

---

## 2. Domain 패키지 구조 (Domain-Driven)

```
com.company.project/
│
├── ProjectApplication.java
│
├── domain/                          # 🎯 도메인 레이어 (핵심)
│   ├── user/
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   └── UserServiceImpl.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   └── UserStatus.java (Enum)
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   ├── CreateUserRequest.java
│   │   │   │   └── UpdateUserRequest.java
│   │   │   └── response/
│   │   │       ├── UserResponse.java
│   │   │       └── UserDetailResponse.java
│   │   └── exception/
│   │       ├── UserNotFoundException.java
│   │       └── DuplicateEmailException.java
│   │
│   ├── product/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── exception/
│   │
│   └── order/
│       └── (동일 구조)
│
├── common/                          # 📦 공통 컴포넌트
│   ├── entity/
│   │   ├── BaseEntity.java          # id만
│   │   ├── BaseTimeEntity.java      # + createdAt, updatedAt
│   │   └── BaseAuditEntity.java     # + createdBy, updatedBy
│   ├── dto/
│   │   ├── PageResponse.java
│   │   ├── SliceResponse.java
│   │   └── ErrorResponse.java
│   ├── exception/
│   │   ├── BusinessException.java   # 최상위
│   │   ├── NotFoundException.java
│   │   ├── DuplicateException.java
│   │   ├── UnauthorizedException.java
│   │   ├── ForbiddenException.java
│   │   └── GlobalExceptionHandler.java
│   ├── constant/
│   │   └── ErrorCode.java           # Enum
│   ├── util/
│   │   ├── DateTimeUtil.java
│   │   └── StringUtil.java
│   └── annotation/
│       └── CurrentUser.java
│
├── config/                          # ⚙️ 설정
│   ├── JpaConfig.java
│   ├── WebMvcConfig.java
│   ├── SwaggerConfig.java
│   └── CorsConfig.java (optional)
│
└── security/                        # 🔒 보안
    ├── config/
    │   └── SecurityConfig.java
    ├── jwt/
    │   ├── JwtTokenProvider.java
    │   └── JwtAuthenticationFilter.java
    └── service/
        └── CustomUserDetailsService.java
```

---

## 3. Domain-Driven 구조 장점

```
✅ 도메인별 응집도 높음
✅ 변경 시 영향 범위 명확
✅ 팀 분업 용이
✅ 마이크로서비스 전환 쉬움

장점:
- user 관련 변경 시 domain/user 폴더만 확인
- 각 도메인이 독립적으로 동작
- 팀원마다 도메인 담당 가능
```

---

## 4. 패키지 의존성 규칙

```
✅ 허용되는 의존성:

Controller → Service → Repository → Entity
    ↓          ↓           ↓
   DTO    ←   DTO      ←  Entity
    ↓          ↓
 Common    Common

domain.user → common (✅)
domain.product → common (✅)
domain.user → domain.product (⚠️ 최소화)

❌ 금지되는 의존성:

common → domain.user (❌)
Repository → Service (❌)
Entity → DTO (❌)
Controller → Repository (❌) Service 거쳐야
```

---

## 5. Common vs Domain 구분

### ✅ Common에 포함

```
- BaseEntity, BaseTimeEntity
- PageResponse, ErrorResponse
- BusinessException, NotFoundException
- ErrorCode (모든 도메인)
- 공통 유틸 (DateTimeUtil)
- 공통 Annotation
```

### ✅ Domain에 포함

```
- 도메인 특화 예외 (UserNotFoundException)
- 도메인 특화 DTO
- 도메인 비즈니스 로직
```

### ❌ Common에 포함 금지

```
- 특정 도메인에만 사용되는 클래스
- 비즈니스 로직
```

---

## 6. 파일 네이밍

**Controller**: `UserController`, `UserAdminController`
**Service**: `UserService` (Interface), `UserServiceImpl`
**Repository**: `UserRepository`, `UserRepositoryCustom`, `UserRepositoryImpl`
**Entity**: `User`, `UserStatus` (Enum)
**DTO**: `CreateUserRequest`, `UpdateUserRequest`, `UserResponse`
**Exception**: `UserNotFoundException`, `DuplicateEmailException`
**Config**: `SecurityConfig`, `JpaConfig`

---

## 7. Resources & Test

**Resources**: `application.yml`, `application-{env}.yml`, `data.sql` (선택)
**Test**: `domain/{domain}/` → `XxxControllerTest` (@WebMvcTest), `XxxServiceTest` (@ExtendWith), `XxxRepositoryTest` (@DataJpaTest)

---

## 9. build.gradle 기본 의존성

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.x'
    id 'io.spring.dependency-management' version '1.1.x'
}

java {
    sourceCompatibility = '17'  // or '21'
}

dependencies {
    // Spring Boot
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // Database
    runtimeOnly 'com.h2database:h2'  // dev
    runtimeOnly 'com.mysql:mysql-connector-j'  // prod

    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // Test
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

---

## 10. 실전 예제

```
com.company.ecommerce/
├── domain/
│   ├── product/, order/, user/  (각각 동일 구조)
├── common/
│   ├── entity/BaseTimeEntity
│   ├── exception/GlobalExceptionHandler
│   └── constant/ErrorCode
├── config/ (JpaConfig, WebMvcConfig)
└── security/ (SecurityConfig)
```

