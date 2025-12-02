package com.example.demo.domain.tenant.repository;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.entity.TenantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long>, JpaSpecificationExecutor<Tenant> {

    Optional<Tenant> findByCode(String code);

    boolean existsByCode(String code);

    List<Tenant> findByStatus(TenantStatus status);

    @Query("SELECT t FROM Tenant t LEFT JOIN FETCH t.branding LEFT JOIN FETCH t.settings WHERE t.id = :id")
    Optional<Tenant> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT t FROM Tenant t LEFT JOIN FETCH t.branding LEFT JOIN FETCH t.settings WHERE t.code = :code")
    Optional<Tenant> findByCodeWithDetails(@Param("code") String code);

    @Query("SELECT t FROM Tenant t WHERE t.status = 'ACTIVE'")
    List<Tenant> findAllActive();

    // ==================== 페이징 메서드 ====================

    /**
     * 상태별 테넌트 목록 페이징 조회
     */
    Page<Tenant> findByStatus(TenantStatus status, Pageable pageable);

    /**
     * 테넌트명으로 검색 (페이징)
     */
    @Query("SELECT t FROM Tenant t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Tenant> searchByName(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 상태와 테넌트명으로 검색 (페이징)
     */
    @Query("SELECT t FROM Tenant t " +
           "WHERE t.status = :status " +
           "AND LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Tenant> searchByStatusAndName(
        @Param("status") TenantStatus status,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    /**
     * 활성 테넌트 목록 페이징 조회
     */
    @Query("SELECT t FROM Tenant t WHERE t.status = 'ACTIVE'")
    Page<Tenant> findAllActive(Pageable pageable);

    /**
     * 상태별 테넌트 수 카운트
     */
    long countByStatus(TenantStatus status);
}
