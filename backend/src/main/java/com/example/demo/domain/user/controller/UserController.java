package com.example.demo.domain.user.controller;

import com.example.demo.domain.user.dto.UserProfileResponse;
import com.example.demo.domain.user.dto.UserResponse;
import com.example.demo.domain.user.service.UserService;
import com.example.demo.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User REST API Controller
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 전체 유저 목록 조회 (OPERATOR용)
     * GET /api/users
     * 권한: OPERATOR 이상
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * 유저 단건 조회 (OPERATOR용)
     * GET /api/users/{id}
     * 권한: OPERATOR 이상
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable @Positive Long id) {
        UserResponse user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * 내 프로필 조회 (본인 정보 + 강사 배정 강의 + 수강 강의)
     * GET /api/users/me/profile
     * 권한: 인증된 사용자
     */
    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        UserProfileResponse profile = userService.getMyProfile(userId);
        return ResponseEntity.ok(profile);
    }
}
