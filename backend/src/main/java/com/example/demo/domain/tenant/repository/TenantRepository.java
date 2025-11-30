package com.example.demo.domain.tenant.repository;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.entity.TenantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {

    Optional<Tenant> findByCode(String code);

    boolean existsByCode(String code);

    List<Tenant> findByStatus(TenantStatus status);

    @Query("SELECT t FROM Tenant t LEFT JOIN FETCH t.branding LEFT JOIN FETCH t.settings WHERE t.id = :id")
    Optional<Tenant> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT t FROM Tenant t LEFT JOIN FETCH t.branding LEFT JOIN FETCH t.settings WHERE t.code = :code")
    Optional<Tenant> findByCodeWithDetails(@Param("code") String code);

    @Query("SELECT t FROM Tenant t WHERE t.status = 'ACTIVE'")
    List<Tenant> findAllActive();
}
