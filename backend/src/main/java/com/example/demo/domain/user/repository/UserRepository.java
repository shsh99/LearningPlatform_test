package com.example.demo.domain.user.repository;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.status = 'ACTIVE'")
    Optional<User> findActiveUserByEmail(@Param("email") String email);

    /**
     * 이메일 또는 이름으로 사용자 검색 (ACTIVE 상태만)
     */
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE' AND (LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchActiveUsers(@Param("query") String query);

    /**
     * 테넌트 ID와 역할로 사용자 목록 조회 (ACTIVE 상태만)
     */
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.role = :role AND u.status = 'ACTIVE'")
    List<User> findByTenantIdAndRole(@Param("tenantId") Long tenantId, @Param("role") UserRole role);
}
