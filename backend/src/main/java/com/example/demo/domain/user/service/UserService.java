package com.example.demo.domain.user.service;

import com.example.demo.domain.user.dto.UserResponse;
import com.example.demo.domain.user.dto.UserProfileResponse;

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
     * 유저 프로필 조회 (본인 정보 + 강사 배정 강의 + 수강 강의)
     */
    UserProfileResponse getMyProfile(Long userId);
}
