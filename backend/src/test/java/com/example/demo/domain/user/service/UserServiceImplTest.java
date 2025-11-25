package com.example.demo.domain.user.service;

import com.example.demo.domain.user.dto.ChangePasswordRequest;
import com.example.demo.domain.user.dto.UpdateProfileRequest;
import com.example.demo.domain.user.dto.UserResponse;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.entity.UserStatus;
import com.example.demo.domain.user.exception.UserNotFoundException;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.UnauthorizedException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService 테스트")
class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("프로필 수정 성공")
    void updateMyProfile_Success() {
        // Given
        Long userId = 1L;
        String newName = "새로운이름";
        UpdateProfileRequest request = new UpdateProfileRequest(newName);

        User user = User.create("test@example.com", "encodedPassword", "기존이름");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        UserResponse result = userService.updateMyProfile(userId, request);

        // Then
        assertThat(result.name()).isEqualTo(newName);
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("프로필 수정 실패 - 사용자 없음")
    void updateMyProfile_UserNotFound() {
        // Given
        Long userId = 999L;
        UpdateProfileRequest request = new UpdateProfileRequest("새이름");
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.updateMyProfile(userId, request))
            .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    @DisplayName("비밀번호 변경 성공")
    void changeMyPassword_Success() {
        // Given
        Long userId = 1L;
        String currentPassword = "oldPassword123!";
        String newPassword = "newPassword456!";
        ChangePasswordRequest request = new ChangePasswordRequest(
            currentPassword,
            newPassword,
            newPassword
        );

        User user = User.create("test@example.com", "encodedOldPassword", "테스트");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");

        // When
        userService.changeMyPassword(userId, request);

        // Then
        verify(userRepository).findById(userId);
        verify(passwordEncoder).matches(currentPassword, "encodedOldPassword");
        verify(passwordEncoder).encode(newPassword);
    }

    @Test
    @DisplayName("비밀번호 변경 실패 - 현재 비밀번호 불일치")
    void changeMyPassword_InvalidCurrentPassword() {
        // Given
        Long userId = 1L;
        String currentPassword = "wrongPassword";
        String newPassword = "newPassword456!";
        ChangePasswordRequest request = new ChangePasswordRequest(
            currentPassword,
            newPassword,
            newPassword
        );

        User user = User.create("test@example.com", "encodedOldPassword", "테스트");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> userService.changeMyPassword(userId, request))
            .isInstanceOf(UnauthorizedException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_CURRENT_PASSWORD);
    }

    @Test
    @DisplayName("비밀번호 변경 실패 - 새 비밀번호 불일치")
    void changeMyPassword_PasswordsDoNotMatch() {
        // Given
        Long userId = 1L;
        String currentPassword = "oldPassword123!";
        String newPassword = "newPassword456!";
        String confirmPassword = "differentPassword789!";
        ChangePasswordRequest request = new ChangePasswordRequest(
            currentPassword,
            newPassword,
            confirmPassword
        );

        User user = User.create("test@example.com", "encodedOldPassword", "테스트");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> userService.changeMyPassword(userId, request))
            .isInstanceOf(UnauthorizedException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.PASSWORDS_DO_NOT_MATCH);
    }

    @Test
    @DisplayName("비밀번호 변경 실패 - 사용자 없음")
    void changeMyPassword_UserNotFound() {
        // Given
        Long userId = 999L;
        ChangePasswordRequest request = new ChangePasswordRequest(
            "oldPassword123!",
            "newPassword456!",
            "newPassword456!"
        );
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.changeMyPassword(userId, request))
            .isInstanceOf(UserNotFoundException.class);
    }
}
