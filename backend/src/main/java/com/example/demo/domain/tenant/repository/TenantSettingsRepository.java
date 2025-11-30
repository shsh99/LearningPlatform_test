package com.example.demo.domain.tenant.repository;

import com.example.demo.domain.tenant.entity.TenantSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantSettingsRepository extends JpaRepository<TenantSettings, Long> {
}
