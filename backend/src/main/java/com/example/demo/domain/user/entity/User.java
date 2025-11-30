package com.example.demo.domain.user.entity;

import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.global.common.BaseTimeEntity;
import com.example.demo.global.tenant.TenantAware;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@EntityListeners(com.example.demo.global.tenant.TenantEntityListener.class)
public class User extends BaseTimeEntity implements TenantAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    private Tenant tenant;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    private User(String email, String password, String name, UserRole role, Long tenantId) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.status = UserStatus.ACTIVE;
        this.tenantId = tenantId;
    }

    public static User create(String email, String password, String name) {
        return new User(email, password, name, UserRole.USER, null);
    }

    public static User create(String email, String password, String name, Long tenantId) {
        return new User(email, password, name, UserRole.USER, tenantId);
    }

    public static User createWithRole(String email, String password, String name, UserRole role, Long tenantId) {
        return new User(email, password, name, role, tenantId);
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    public void updateName(String newName) {
        this.name = newName;
    }

    public void deactivate() {
        this.status = UserStatus.INACTIVE;
    }

    public void activate() {
        this.status = UserStatus.ACTIVE;
    }

    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }

    public void delete() {
        this.status = UserStatus.DELETED;
        this.deletedAt = LocalDateTime.now();
    }
}
