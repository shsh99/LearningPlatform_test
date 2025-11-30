package com.example.demo.domain.user.service;

import com.example.demo.domain.auth.repository.PasswordResetTokenRepository;
import com.example.demo.domain.auth.repository.RefreshTokenRepository;
import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.exception.TenantNotFoundException;
import com.example.demo.domain.tenant.repository.TenantRepository;
import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.user.dto.ChangePasswordRequest;
import com.example.demo.domain.user.dto.CreateOperatorRequest;
import com.example.demo.domain.user.dto.CreateTenantAdminRequest;
import com.example.demo.domain.user.dto.UpdateProfileRequest;
import com.example.demo.domain.user.dto.UserProfileResponse;
import com.example.demo.domain.user.dto.UserResponse;
import com.example.demo.domain.user.dto.WithdrawRequest;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.exception.UserNotFoundException;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.global.exception.DuplicateException;
import com.example.demo.global.exception.ErrorCode;
import com.example.demo.global.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * User Service 구현체
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
        return UserResponse.from(user);
    }

    @Override
    public List<com.example.demo.domain.user.dto.UserSearchResponse> searchUsers(String query) {
        List<User> users = userRepository.searchActiveUsers(query);
        return users.stream()
            .map(com.example.demo.domain.user.dto.UserSearchResponse::from)
            .collect(Collectors.toList());
    }

    @Override
    public UserProfileResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        // 강사로 배정된 강의 조회 (ASSIGNED 상태만)
        List<InstructorAssignment> assignments = instructorAssignmentRepository
            .findByInstructorAndStatus(user, AssignmentStatus.ASSIGNED);

        List<UserProfileResponse.InstructorAssignmentInfo> assignmentInfos = assignments.stream()
            .map(assignment -> new UserProfileResponse.InstructorAssignmentInfo(
                assignment.getId(),
                assignment.getTerm().getId(),
                assignment.getTerm().getTermNumber(),
                assignment.getTerm().getCourse().getTitle(),
                assignment.getTerm().getCourse().getDescription(),
                assignment.getTerm().getStartDate(),
                assignment.getTerm().getEndDate(),
                assignment.getTerm().getMaxStudents(),
                assignment.getTerm().getCurrentStudents(),
                assignment.getTerm().getStatus().name(),
                assignment.getStatus().name()
            ))
            .collect(Collectors.toList());

        // 수강 중인 강의 조회 (ENROLLED 상태만)
        List<Enrollment> enrollments = enrollmentRepository
            .findEnrollmentsWithCourseByStudentAndStatus(user, EnrollmentStatus.ENROLLED);

        List<UserProfileResponse.EnrollmentInfo> enrollmentInfos = enrollments.stream()
            .map(enrollment -> new UserProfileResponse.EnrollmentInfo(
                enrollment.getId(),
                enrollment.getTerm().getId(),
                enrollment.getTerm().getTermNumber(),
                enrollment.getTerm().getCourse().getTitle(),
                enrollment.getTerm().getCourse().getDescription(),
                enrollment.getTerm().getStartDate(),
                enrollment.getTerm().getEndDate(),
                enrollment.getTerm().getStatus().name(),
                enrollment.getStatus().name(),
                enrollment.getCreatedAt()
            ))
            .collect(Collectors.toList());

        return UserProfileResponse.of(user, assignmentInfos, enrollmentInfos);
    }

    @Override
    @Transactional
    public UserResponse updateMyProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        user.updateName(request.name());

        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public void changeMyPassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new UnauthorizedException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new UnauthorizedException(ErrorCode.PASSWORDS_DO_NOT_MATCH);
        }

        String encodedPassword = passwordEncoder.encode(request.newPassword());
        user.updatePassword(encodedPassword);
    }

    @Override
    @Transactional
    public void withdrawAccount(Long userId, WithdrawRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        // 회원 탈퇴 처리 (소프트 삭제)
        user.delete();

        // 토큰 삭제
        refreshTokenRepository.deleteByUserId(userId);
        passwordResetTokenRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional
    public UserResponse createTenantAdmin(CreateTenantAdminRequest request) {
        log.info("Creating tenant admin for tenant: {}", request.tenantId());

        // 1. 테넌트 존재 및 활성 상태 확인
        Tenant tenant = tenantRepository.findById(request.tenantId())
            .orElseThrow(() -> new TenantNotFoundException(request.tenantId()));

        if (!tenant.isActive()) {
            throw new DuplicateException(ErrorCode.TENANT_NOT_ACTIVE);
        }

        // 2. 이메일 중복 확인
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateException(ErrorCode.USER_ALREADY_EXISTS);
        }

        // 3. 비밀번호 인코딩
        String encodedPassword = passwordEncoder.encode(request.password());

        // 4. 테넌트 어드민 생성
        User tenantAdmin = User.createWithRole(
            request.email(),
            encodedPassword,
            request.name(),
            UserRole.TENANT_ADMIN,
            request.tenantId()
        );

        User saved = userRepository.save(tenantAdmin);

        log.info("Tenant admin created: id={}, email={}, tenantId={}",
            saved.getId(), saved.getEmail(), saved.getTenantId());

        return UserResponse.from(saved);
    }

    @Override
    @Transactional
    public UserResponse createOperator(CreateOperatorRequest request, Long tenantAdminId) {
        // 1. 요청자(TENANT_ADMIN) 정보 조회
        User tenantAdmin = userRepository.findById(tenantAdminId)
            .orElseThrow(() -> new UserNotFoundException(tenantAdminId));

        // 2. TENANT_ADMIN 권한 및 테넌트 확인
        if (tenantAdmin.getRole() != UserRole.TENANT_ADMIN) {
            throw new UnauthorizedException(ErrorCode.FORBIDDEN);
        }

        Long tenantId = tenantAdmin.getTenantId();
        if (tenantId == null) {
            throw new UnauthorizedException(ErrorCode.FORBIDDEN);
        }

        // 3. 테넌트 존재 및 활성 상태 확인
        Tenant tenant = tenantRepository.findById(tenantId)
            .orElseThrow(() -> new TenantNotFoundException(tenantId));

        if (!tenant.isActive()) {
            throw new DuplicateException(ErrorCode.TENANT_NOT_ACTIVE);
        }

        // 4. 이메일 중복 확인
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateException(ErrorCode.USER_ALREADY_EXISTS);
        }

        // 5. 비밀번호 인코딩
        String encodedPassword = passwordEncoder.encode(request.password());

        // 6. 오퍼레이터 생성 (같은 테넌트로)
        User operator = User.createWithRole(
            request.email(),
            encodedPassword,
            request.name(),
            UserRole.OPERATOR,
            tenantId
        );

        User saved = userRepository.save(operator);

        log.info("Operator created: id={}, email={}, tenantId={}, createdBy={}",
            saved.getId(), saved.getEmail(), saved.getTenantId(), tenantAdminId);

        return UserResponse.from(saved);
    }

    @Override
    public List<UserResponse> getOperatorsByTenant(Long tenantAdminId) {
        // 1. 요청자(TENANT_ADMIN) 정보 조회
        User tenantAdmin = userRepository.findById(tenantAdminId)
            .orElseThrow(() -> new UserNotFoundException(tenantAdminId));

        // 2. TENANT_ADMIN 권한 및 테넌트 확인
        if (tenantAdmin.getRole() != UserRole.TENANT_ADMIN) {
            throw new UnauthorizedException(ErrorCode.FORBIDDEN);
        }

        Long tenantId = tenantAdmin.getTenantId();
        if (tenantId == null) {
            throw new UnauthorizedException(ErrorCode.FORBIDDEN);
        }

        // 3. 해당 테넌트의 OPERATOR 목록 조회
        List<User> operators = userRepository.findByTenantIdAndRole(tenantId, UserRole.OPERATOR);

        return operators.stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }
}
