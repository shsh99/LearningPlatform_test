package com.example.demo.global.config;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.StudentInformationSystem;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.enrollment.repository.StudentInformationSystemRepository;
import com.example.demo.domain.tenant.entity.Tenant;
import com.example.demo.domain.tenant.entity.TenantBranding;
import com.example.demo.domain.tenant.entity.TenantLabels;
import com.example.demo.domain.tenant.entity.TenantSettings;
import com.example.demo.domain.tenant.repository.TenantBrandingRepository;
import com.example.demo.domain.tenant.repository.TenantLabelsRepository;
import com.example.demo.domain.tenant.repository.TenantRepository;
import com.example.demo.domain.tenant.repository.TenantSettingsRepository;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.InstructorInformationSystem;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.timeschedule.repository.InstructorInformationSystemRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * 테스트용 초기 데이터 생성
 * - SUPER_ADMIN
 * - 2개 테넌트 (techcorp, edustart)
 * - 각 테넌트별: TENANT_ADMIN 1명, OPERATOR 1명, USER 10명
 * - 각 테넌트별: 강의 3개, 차수 2개씩
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final TenantBrandingRepository tenantBrandingRepository;
    private final TenantSettingsRepository tenantSettingsRepository;
    private final TenantLabelsRepository tenantLabelsRepository;
    private final CourseRepository courseRepository;
    private final CourseTermRepository courseTermRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;
    private final InstructorInformationSystemRepository iisRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentInformationSystemRepository sisRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // 1. 기본 테넌트 생성
        createDefaultTenant();

        // 2. SUPER_ADMIN 계정 생성
        if (!userRepository.existsByEmail("superadmin@admin.com")) {
            String encodedPassword = passwordEncoder.encode("1q2w3e4r");
            User superAdmin = User.createWithRole("superadmin@admin.com", encodedPassword, "슈퍼관리자", UserRole.SUPER_ADMIN, null);
            userRepository.save(superAdmin);
            log.info("SUPER_ADMIN account created: superadmin@admin.com / 1q2w3e4r");
        }

        // 3. 테스트 테넌트 생성
        createTestTenant("techcorp", "테크코프", "#1e40af", "#3b82f6");
        createTestTenant("edustart", "에듀스타트", "#047857", "#10b981");
    }

    private void createDefaultTenant() {
        if (tenantRepository.existsByCode("default")) {
            log.info("Default tenant already exists");
            return;
        }

        Tenant tenant = Tenant.create("default", "기본 테넌트", "localhost");
        tenant = tenantRepository.save(tenant);

        TenantBranding branding = TenantBranding.createDefault(tenant);
        tenantBrandingRepository.save(branding);

        TenantSettings settings = TenantSettings.createDefault(tenant);
        tenantSettingsRepository.save(settings);

        TenantLabels labels = TenantLabels.createDefault(tenant);
        tenantLabelsRepository.save(labels);

        log.info("Default tenant created: default");
    }

    private void createTestTenant(String code, String name, String primaryColor, String secondaryColor) {
        if (tenantRepository.existsByCode(code)) {
            log.info("Tenant {} already exists", code);
            return;
        }

        // 테넌트 생성
        Tenant tenant = Tenant.create(code, name, code + ".localhost");
        tenant = tenantRepository.save(tenant);
        Long tenantId = tenant.getId();

        // 브랜딩 설정
        TenantBranding branding = TenantBranding.createDefault(tenant);
        branding.updatePrimaryColor(primaryColor);
        branding.updateSecondaryColor(secondaryColor);
        branding.updateHeaderColors("#ffffff", "#1f2937");
        branding.updateButtonColors(primaryColor, "#ffffff", "#f3f4f6", "#374151");
        tenantBrandingRepository.save(branding);

        // 기본 설정
        TenantSettings settings = TenantSettings.createDefault(tenant);
        tenantSettingsRepository.save(settings);

        // 라벨 설정
        TenantLabels labels = TenantLabels.createDefault(tenant);
        tenantLabelsRepository.save(labels);

        String encodedPassword = passwordEncoder.encode("1q2w3e4r");

        // TENANT_ADMIN 생성
        User tenantAdmin = User.createWithRole(
                code + "_admin@test.com",
                encodedPassword,
                name + " 관리자",
                UserRole.TENANT_ADMIN,
                tenantId
        );
        userRepository.save(tenantAdmin);
        log.info("TENANT_ADMIN created: {}@test.com", code + "_admin");

        // OPERATOR 생성
        User operator = User.createWithRole(
                code + "_operator@test.com",
                encodedPassword,
                name + " 오퍼레이터",
                UserRole.OPERATOR,
                tenantId
        );
        userRepository.save(operator);
        log.info("OPERATOR created: {}@test.com", code + "_operator");

        // USER 10명 생성
        List<User> users = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            User user = User.create(
                    code + "_user" + i + "@test.com",
                    encodedPassword,
                    name + " 사용자" + i,
                    tenantId
            );
            users.add(userRepository.save(user));
        }
        log.info("10 users created for tenant: {}", code);

        // 강사 역할 가능 사용자 3명 생성 (role은 USER, InstructorAssignment로 강사 권한 부여)
        List<User> instructors = new ArrayList<>();
        String[] instructorNames = {"김강사", "이강사", "박강사"};
        for (int i = 1; i <= 3; i++) {
            User instructor = User.create(
                    code + "_instructor" + i + "@test.com",
                    encodedPassword,
                    name + " " + instructorNames[i - 1],
                    tenantId
            );
            instructors.add(userRepository.save(instructor));
        }
        log.info("3 instructor-eligible users created for tenant: {}", code);

        // 강의 3개 생성
        String[] courseTitles = {
                "Java 프로그래밍 기초",
                "Spring Boot 웹 개발",
                "React 프론트엔드 개발"
        };
        String[] courseDescriptions = {
                "자바 프로그래밍의 기초부터 객체지향 프로그래밍까지 학습합니다.",
                "Spring Boot를 활용한 RESTful API 개발을 배웁니다.",
                "React와 TypeScript를 활용한 모던 프론트엔드 개발을 학습합니다."
        };

        List<CourseTerm> allTerms = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            Course course = Course.create(
                    courseTitles[i],
                    courseDescriptions[i],
                    30,
                    tenantId
            );
            course = courseRepository.save(course);

            // 각 강의당 차수 2개 생성 및 반환
            List<CourseTerm> terms = createCourseTerms(course);
            allTerms.addAll(terms);
        }
        log.info("3 courses with terms created for tenant: {}", code);

        // InstructorAssignment 및 IIS 생성 - 각 차수에 강사 배정
        for (int i = 0; i < allTerms.size(); i++) {
            CourseTerm term = allTerms.get(i);
            User instructor = instructors.get(i % instructors.size()); // 순환 배정

            InstructorAssignment assignment = InstructorAssignment.create(
                    term,
                    instructor,
                    operator // 배정자는 오퍼레이터
            );
            InstructorAssignment savedAssignment = instructorAssignmentRepository.save(assignment);

            // IIS 레코드 생성
            InstructorInformationSystem iis = InstructorInformationSystem.create(
                    instructor.getId(),
                    term.getId(),
                    savedAssignment
            );
            iisRepository.save(iis);
        }
        log.info("InstructorAssignments and IIS records created for tenant: {}", code);

        // Enrollment 및 SIS 생성 - 각 차수에 사용자 수강 등록
        for (int i = 0; i < allTerms.size(); i++) {
            CourseTerm term = allTerms.get(i);
            // 각 차수에 3명씩 수강 등록
            for (int j = 0; j < 3; j++) {
                int userIndex = (i * 3 + j) % users.size();
                User student = users.get(userIndex);

                Enrollment enrollment = Enrollment.create(term, student);
                Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

                // SIS 레코드 생성
                StudentInformationSystem sis = StudentInformationSystem.create(
                        student.getId(),
                        term.getId(),
                        savedEnrollment
                );
                sisRepository.save(sis);

                // 차수의 현재 학생 수 증가
                term.increaseStudentCount();
            }
            courseTermRepository.save(term);
        }
        log.info("Enrollments and SIS records created for tenant: {}", code);

        log.info("Test tenant created: {} ({})", name, code);
    }

    private List<CourseTerm> createCourseTerms(Course course) {
        LocalDate today = LocalDate.now();
        List<CourseTerm> terms = new ArrayList<>();

        // 1차수: 이번 달
        CourseTerm term1 = CourseTerm.create(
                course,
                1,
                today.plusDays(7),
                today.plusDays(37),
                Set.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY),
                LocalTime.of(9, 0),
                LocalTime.of(12, 0),
                20
        );
        terms.add(courseTermRepository.save(term1));

        // 2차수: 다음 달
        CourseTerm term2 = CourseTerm.create(
                course,
                2,
                today.plusDays(45),
                today.plusDays(75),
                Set.of(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY),
                LocalTime.of(14, 0),
                LocalTime.of(17, 0),
                25
        );
        terms.add(courseTermRepository.save(term2));

        return terms;
    }
}
