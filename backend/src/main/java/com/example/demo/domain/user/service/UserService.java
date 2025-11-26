package com.example.demo.domain.user.service;

import com.example.demo.domain.user.dto.ChangePasswordRequest;
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
}
