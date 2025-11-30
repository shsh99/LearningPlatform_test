package com.example.demo.domain.auth.entity;

import com.example.demo.domain.user.entity.User;
import com.example.demo.global.common.BaseTimeEntity;
import com.example.demo.global.tenant.TenantAware;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = Long.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class PasswordResetToken extends BaseTimeEntity implements TenantAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tenant_id")
    private Long tenantId;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean isUsed;

    private PasswordResetToken(User user, Long tenantId, String token, LocalDateTime expiresAt) {
        this.user = user;
        this.tenantId = tenantId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.isUsed = false;
    }

    public static PasswordResetToken create(User user, String token, int expirationMinutes) {
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(expirationMinutes);
        return new PasswordResetToken(user, user.getTenantId(), token, expiresAt);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void markAsUsed() {
        this.isUsed = true;
    }

    public boolean isValid() {
        return !isUsed && !isExpired();
    }
}
