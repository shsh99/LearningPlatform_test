package com.example.demo.domain.user.repository;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.status = com.example.demo.domain.user.entity.UserStatus.ACTIVE")
    Optional<User> findActiveUserByEmail(@Param("email") String email);

    /**
     * 이메일 또는 이름으로 사용자 검색 (ACTIVE 상태만)
     */
    @Query("SELECT u FROM User u WHERE u.status = com.example.demo.domain.user.entity.UserStatus.ACTIVE AND (LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchActiveUsers(@Param("query") String query);

    /**
     * 테넌트 ID와 역할로 사용자 목록 조회 (ACTIVE 상태만)
     */
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.role = :role AND u.status = com.example.demo.domain.user.entity.UserStatus.ACTIVE")
    List<User> findByTenantIdAndRole(@Param("tenantId") Long tenantId, @Param("role") UserRole role);

    /**
     * 테넌트 ID로 전체 사용자 목록 조회 (ACTIVE 상태만)
     */
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.status = com.example.demo.domain.user.entity.UserStatus.ACTIVE")
    List<User> findByTenantId(@Param("tenantId") Long tenantId);

    /**
     * 테넌트 ID로 사용자 검색 (이메일 또는 이름, ACTIVE 상태만)
     */
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.status = com.example.demo.domain.user.entity.UserStatus.ACTIVE AND (LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchActiveUsersByTenant(@Param("tenantId") Long tenantId, @Param("query") String query);

    /**
     * 테넌트 ID로 사용자 수 카운트 (필터 무시, 직접 쿼리)
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);

    // ==================== 페이징 메서드 ====================

    /**
     * 테넌트 ID로 사용자 목록 페이징 조회
     */
    Page<User> findByTenantId(Long tenantId, Pageable pageable);

    /**
     * 테넌트 ID와 상태로 사용자 목록 페이징 조회
     */
    Page<User> findByTenantIdAndStatus(Long tenantId, UserStatus status, Pageable pageable);

    /**
     * 테넌트 ID와 역할로 사용자 목록 페이징 조회
     */
    Page<User> findByTenantIdAndRole(Long tenantId, UserRole role, Pageable pageable);

    /**
     * 테넌트 ID, 역할, 상태로 사용자 목록 페이징 조회
     */
    Page<User> findByTenantIdAndRoleAndStatus(Long tenantId, UserRole role, UserStatus status, Pageable pageable);

    /**
     * 테넌트 ID로 사용자 검색 페이징 (이메일 또는 이름, ACTIVE 상태만)
     */
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId " +
           "AND u.status = com.example.demo.domain.user.entity.UserStatus.ACTIVE " +
           "AND (LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<User> searchActiveUsersByTenant(@Param("tenantId") Long tenantId, @Param("query") String query, Pageable pageable);

    /**
     * 역할별 사용자 수 카운트
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.tenantId = :tenantId AND u.role = :role")
    long countByTenantIdAndRole(@Param("tenantId") Long tenantId, @Param("role") UserRole role);
}
