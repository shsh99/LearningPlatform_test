package com.example.demo.domain.auth.service;

import com.example.demo.domain.auth.dto.ForgotPasswordRequest;
import com.example.demo.domain.auth.dto.ResetPasswordRequest;
import com.example.demo.domain.auth.entity.PasswordResetToken;
import com.example.demo.domain.auth.repository.PasswordResetTokenRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.email.EmailService;
import com.example.demo.global.exception.BusinessException;
import com.example.demo.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServicePasswordResetTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("비밀번호 재설정 요청 성공")
    void requestPasswordReset_Success() {
        // Given
        String email = "test@example.com";
        ForgotPasswordRequest request = new ForgotPasswordRequest(email);
        User user = User.create(email, "encodedPassword", "테스트");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        authService.requestPasswordReset(request);

        // Then
        verify(userRepository).findByEmail(email);
        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));

        ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendPasswordResetEmail(emailCaptor.capture(), tokenCaptor.capture());

        assertThat(emailCaptor.getValue()).isEqualTo(email);
        assertThat(tokenCaptor.getValue()).isNotNull();
    }

    @Test
    @DisplayName("비밀번호 재설정 요청 - 존재하지 않는 이메일 (보안상 성공 응답)")
    void requestPasswordReset_NonExistentEmail() {
        // Given
        String email = "nonexistent@example.com";
        ForgotPasswordRequest request = new ForgotPasswordRequest(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        authService.requestPasswordReset(request);

        // Then
        verify(userRepository).findByEmail(email);
        verify(passwordResetTokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
    }

    @Test
    @DisplayName("비밀번호 재설정 성공")
    void resetPassword_Success() {
        // Given
        String token = "valid-token";
        String newPassword = "newPassword123!";
        ResetPasswordRequest request = new ResetPasswordRequest(token, newPassword, newPassword);

        User user = User.create("test@example.com", "oldPassword", "테스트");
        PasswordResetToken resetToken = PasswordResetToken.create(user, token, 60);

        when(passwordResetTokenRepository.findByTokenWithUser(token))
            .thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");

        // When
        authService.resetPassword(request);

        // Then
        verify(passwordResetTokenRepository).findByTokenWithUser(token);
        verify(passwordEncoder).encode(newPassword);
        assertThat(resetToken.getIsUsed()).isTrue();
    }

    @Test
    @DisplayName("비밀번호 재설정 실패 - 새 비밀번호 불일치")
    void resetPassword_PasswordsDoNotMatch() {
        // Given
        String token = "valid-token";
        ResetPasswordRequest request = new ResetPasswordRequest(token, "password1", "password2");

        // When & Then
        assertThatThrownBy(() -> authService.resetPassword(request))
            .isInstanceOf(BusinessException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.PASSWORDS_DO_NOT_MATCH);
    }

    @Test
    @DisplayName("비밀번호 재설정 실패 - 유효하지 않은 토큰")
    void resetPassword_InvalidToken() {
        // Given
        String token = "invalid-token";
        ResetPasswordRequest request = new ResetPasswordRequest(token, "password", "password");

        when(passwordResetTokenRepository.findByTokenWithUser(token))
            .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.resetPassword(request))
            .isInstanceOf(BusinessException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_RESET_TOKEN);
    }

    @Test
    @DisplayName("비밀번호 재설정 실패 - 만료된 토큰")
    void resetPassword_ExpiredToken() {
        // Given
        String token = "expired-token";
        String newPassword = "newPassword123!";
        ResetPasswordRequest request = new ResetPasswordRequest(token, newPassword, newPassword);

        User user = User.create("test@example.com", "oldPassword", "테스트");
        PasswordResetToken resetToken = PasswordResetToken.create(user, token, -1);

        when(passwordResetTokenRepository.findByTokenWithUser(token))
            .thenReturn(Optional.of(resetToken));

        // When & Then
        assertThatThrownBy(() -> authService.resetPassword(request))
            .isInstanceOf(BusinessException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.RESET_TOKEN_EXPIRED);
    }

    @Test
    @DisplayName("비밀번호 재설정 실패 - 이미 사용된 토큰")
    void resetPassword_AlreadyUsedToken() {
        // Given
        String token = "used-token";
        String newPassword = "newPassword123!";
        ResetPasswordRequest request = new ResetPasswordRequest(token, newPassword, newPassword);

        User user = User.create("test@example.com", "oldPassword", "테스트");
        PasswordResetToken resetToken = PasswordResetToken.create(user, token, 60);
        resetToken.markAsUsed();

        when(passwordResetTokenRepository.findByTokenWithUser(token))
            .thenReturn(Optional.of(resetToken));

        // When & Then
        assertThatThrownBy(() -> authService.resetPassword(request))
            .isInstanceOf(BusinessException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.RESET_TOKEN_ALREADY_USED);
    }
}
