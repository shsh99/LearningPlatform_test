package com.example.demo.domain.tenant.repository;

import com.example.demo.domain.tenant.entity.TenantBranding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantBrandingRepository extends JpaRepository<TenantBranding, Long> {
}
