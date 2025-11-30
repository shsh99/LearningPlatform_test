package com.example.demo.domain.tenant.repository;

import com.example.demo.domain.tenant.entity.TenantLabels;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantLabelsRepository extends JpaRepository<TenantLabels, Long> {
}
