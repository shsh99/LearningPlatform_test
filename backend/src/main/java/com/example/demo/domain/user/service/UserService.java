package com.example.demo.domain.user.service;

import com.example.demo.domain.user.dto.ChangePasswordRequest;
import com.example.demo.domain.user.dto.CreateOperatorRequest;
import com.example.demo.domain.user.dto.CreateTenantAdminRequest;
import com.example.demo.domain.user.dto.UpdateProfileRequest;
import com.example.demo.domain.user.dto.UserResponse;
import com.example.demo.domain.user.dto.UserProfileResponse;
import com.example.demo.domain.user.dto.UserSearchResponse;
import com.example.demo.domain.user.dto.WithdrawRequest;

import java.util.List;

/**
 * User Service Interface
 */
public interface UserService {
    /**
     * 전체 유저 목록 조회 (OPERATOR용)
     */
    List<UserResponse> findAll();

    /**
     * 유저 단건 조회
     */
    UserResponse findById(Long id);

    /**
     * 유저 검색 (이메일 또는 이름으로)
     */
    List<UserSearchResponse> searchUsers(String query);

    /**
     * 유저 프로필 조회 (본인 정보 + 강사 배정 강의 + 수강 강의)
     */
    UserProfileResponse getMyProfile(Long userId);

    /**
     * 프로필 수정 (이름 변경)
     */
    UserResponse updateMyProfile(Long userId, UpdateProfileRequest request);

    /**
     * 비밀번호 변경
     */
    void changeMyPassword(Long userId, ChangePasswordRequest request);

    /**
     * 회원탈퇴
     */
    void withdrawAccount(Long userId, WithdrawRequest request);

    /**
     * 테넌트 어드민 생성 (SUPER_ADMIN 전용)
     */
    UserResponse createTenantAdmin(CreateTenantAdminRequest request);

    /**
     * 오퍼레이터 생성 (TENANT_ADMIN 전용)
     * @param request 오퍼레이터 생성 요청
     * @param tenantAdminId 요청자(TENANT_ADMIN)의 사용자 ID
     */
    UserResponse createOperator(CreateOperatorRequest request, Long tenantAdminId);

    /**
     * 테넌트의 오퍼레이터 목록 조회 (TENANT_ADMIN 전용)
     */
    List<UserResponse> getOperatorsByTenant(Long tenantAdminId);
}
