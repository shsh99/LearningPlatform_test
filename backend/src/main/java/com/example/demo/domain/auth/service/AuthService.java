package com.example.demo.domain.auth.service;

import com.example.demo.domain.auth.dto.AuthResponse;
import com.example.demo.domain.auth.dto.ForgotPasswordRequest;
import com.example.demo.domain.auth.dto.LoginRequest;
import com.example.demo.domain.auth.dto.ResetPasswordRequest;
import com.example.demo.domain.auth.dto.SignupRequest;
import com.example.demo.domain.auth.dto.TokenResponse;
import com.example.demo.domain.auth.entity.PasswordResetToken;
import com.example.demo.domain.auth.entity.RefreshToken;
import com.example.demo.domain.auth.repository.PasswordResetTokenRepository;
import com.example.demo.domain.auth.repository.RefreshTokenRepository;
import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.repository.TenantRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserStatus;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.email.EmailService;
import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.DuplicateException;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.UnauthorizedException;
import com.example.demo.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateException(ErrorCode.USER_ALREADY_EXISTS);
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        // tenantCode가 제공된 경우 해당 테넌트 조회, 없으면 기본 테넌트(default) 사용
        Long tenantId;
        String tenantCode;
        if (request.tenantCode() != null && !request.tenantCode().isBlank()) {
            Tenant tenant = tenantRepository.findByCode(request.tenantCode())
                .orElseThrow(() -> new BusinessException(ErrorCode.TENANT_NOT_FOUND));
            tenantId = tenant.getId();
            tenantCode = tenant.getCode();
        } else {
            // 기본 테넌트 사용
            Tenant defaultTenant = tenantRepository.findByCode("default")
                .orElseThrow(() -> new BusinessException(ErrorCode.TENANT_NOT_FOUND, "기본 테넌트를 찾을 수 없습니다."));
            tenantId = defaultTenant.getId();
            tenantCode = defaultTenant.getCode();
            log.info("No tenantCode provided, using default tenant: id={}", tenantId);
        }

        User user = User.create(request.email(), encodedPassword, request.name(), tenantId);
        User savedUser = userRepository.save(user);

        TokenResponse tokens = createTokens(savedUser);
        return AuthResponse.of(savedUser, tenantCode, tokens);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS));

        if (user.getStatus() == UserStatus.DELETED) {
            throw new UnauthorizedException(ErrorCode.ACCOUNT_DELETED);
        }

        if (!user.isActive()) {
            throw new UnauthorizedException(ErrorCode.USER_NOT_ACTIVE);
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
        }

        refreshTokenRepository.deleteByUserId(user.getId());

        TokenResponse tokens = createTokens(user);

        // 사용자에게 tenantId가 있으면 tenantCode 조회
        String tenantCode = null;
        if (user.getTenantId() != null) {
            tenantCode = tenantRepository.findById(user.getTenantId())
                .map(Tenant::getCode)
                .orElse(null);
        }

        return AuthResponse.of(user, tenantCode, tokens);
    }

    @Transactional
    public TokenResponse refreshAccessToken(String refreshTokenValue) {
        if (!jwtTokenProvider.validateToken(refreshTokenValue)) {
            throw new UnauthorizedException(ErrorCode.INVALID_TOKEN);
        }

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
            .orElseThrow(() -> new UnauthorizedException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (refreshToken.isExpired()) {
            throw new UnauthorizedException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(refreshTokenValue);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail());

        return TokenResponse.of(
            newAccessToken,
            refreshTokenValue,
            jwtTokenProvider.getAccessTokenExpiration()
        );
    }

    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElse(null);

        if (user == null) {
            return;
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.create(user, token, 60);
        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BusinessException(ErrorCode.PASSWORDS_DO_NOT_MATCH);
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenWithUser(request.token())
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_RESET_TOKEN));

        if (!resetToken.isValid()) {
            if (resetToken.isExpired()) {
                throw new BusinessException(ErrorCode.RESET_TOKEN_EXPIRED);
            } else {
                throw new BusinessException(ErrorCode.RESET_TOKEN_ALREADY_USED);
            }
        }

        User user = resetToken.getUser();

        // 새 비밀번호가 기존 비밀번호와 같은지 확인
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.SAME_AS_OLD_PASSWORD);
        }

        String encodedPassword = passwordEncoder.encode(request.newPassword());
        user.updatePassword(encodedPassword);

        resetToken.markAsUsed();
    }

    private TokenResponse createTokens(User user) {
        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        LocalDateTime refreshTokenExpiresAt = LocalDateTime.now()
            .plusSeconds(jwtTokenProvider.getRefreshTokenExpiration() / 1000);

        RefreshToken refreshTokenEntity = RefreshToken.create(
            user.getId(),
            user.getTenantId(),  // tenantId 추가
            refreshToken,
            refreshTokenExpiresAt
        );
        refreshTokenRepository.save(refreshTokenEntity);

        return TokenResponse.of(
            accessToken,
            refreshToken,
            jwtTokenProvider.getAccessTokenExpiration()
        );
    }
}
