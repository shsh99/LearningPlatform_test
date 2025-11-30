package com.example.demo.global.config;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.courseapplication.entity.CourseApplication;
import com.example.demo.domain.courseapplication.repository.CourseApplicationRepository;
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
import com.example.demo.domain.timeschedule.entity.TermStatus;
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
import java.util.Set;

/**
 * 초기 데이터 생성
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseTermRepository courseTermRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;
    private final InstructorInformationSystemRepository iisRepository;
    private final CourseApplicationRepository courseApplicationRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentInformationSystemRepository sisRepository;
    private final TenantRepository tenantRepository;
    private final TenantBrandingRepository tenantBrandingRepository;
    private final TenantSettingsRepository tenantSettingsRepository;
    private final TenantLabelsRepository tenantLabelsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // 1. 기본 테넌트 생성
        Tenant defaultTenant = createDefaultTenant();

        // 2. SUPER_ADMIN 계정 생성
        if (!userRepository.existsByEmail("superadmin@admin.com")) {
            String encodedPassword = passwordEncoder.encode("1q2w3e4r");
            User superAdmin = User.createWithRole("superadmin@admin.com", encodedPassword, "슈퍼관리자", UserRole.SUPER_ADMIN, null);
            userRepository.save(superAdmin);
            log.info("SUPER_ADMIN account created: superadmin@admin.com / 1q2w3e4r");
        }

        // 3. OPERATOR 계정이 없으면 생성
        User operator;
        if (!userRepository.existsByEmail("admin@admin.com")) {
            String encodedPassword = passwordEncoder.encode("1q2w3e4r");

            operator = User.create("admin@admin.com", encodedPassword, "admin", defaultTenant.getId());
            setUserRole(operator, UserRole.OPERATOR);
            userRepository.save(operator);
            log.info("OPERATOR account created: admin@admin.com / 1q2w3e4r");
        } else {
            operator = userRepository.findByEmail("admin@admin.com").orElse(null);
            log.info("OPERATOR account already exists");
        }

        // 테스트 데이터 생성 (한 번만)
        if (courseRepository.count() == 0) {
            createTestData(operator, defaultTenant);
        }
    }

    private Tenant createDefaultTenant() {
        if (tenantRepository.existsByCode("default")) {
            return tenantRepository.findByCode("default").orElseThrow();
        }

        // 기본 테넌트 생성
        Tenant tenant = Tenant.create("default", "기본 테넌트", "localhost");
        tenant = tenantRepository.save(tenant);

        // 브랜딩 설정 (별도 저장)
        TenantBranding branding = TenantBranding.createDefault(tenant);
        tenantBrandingRepository.save(branding);

        // 기본 설정 (별도 저장)
        TenantSettings settings = TenantSettings.createDefault(tenant);
        tenantSettingsRepository.save(settings);

        // 라벨 설정 (별도 저장)
        TenantLabels labels = TenantLabels.createDefault(tenant);
        tenantLabelsRepository.save(labels);

        log.info("Default tenant created: default");

        return tenant;
    }

    private void createTestData(User operator, Tenant tenant) {
        log.info("Creating test data for dashboard...");

        // 1. 추가 사용자 생성 (강사 3명, 학생 5명)
        User instructor1 = createUser("instructor1@test.com", "김강사", UserRole.USER);
        User instructor2 = createUser("instructor2@test.com", "이강사", UserRole.USER);
        User instructor3 = createUser("instructor3@test.com", "박강사", UserRole.USER);

        User student1 = createUser("student1@test.com", "홍길동", UserRole.USER);
        User student2 = createUser("student2@test.com", "김철수", UserRole.USER);
        User student3 = createUser("student3@test.com", "이영희", UserRole.USER);
        User student4 = createUser("student4@test.com", "박민수", UserRole.USER);
        User student5 = createUser("student5@test.com", "최지은", UserRole.USER);

        log.info("Created 8 test users (3 instructors, 5 students)");

        // 2. 강의 생성 (4개)
        Course course1 = courseRepository.save(Course.create("Java 프로그래밍 기초", "자바 언어의 기초를 배웁니다.", 30));
        Course course2 = courseRepository.save(Course.create("Spring Boot 마스터", "스프링 부트로 웹 애플리케이션을 개발합니다.", 25));
        Course course3 = courseRepository.save(Course.create("React 웹 개발", "React로 모던 웹 프론트엔드를 개발합니다.", 20));
        Course course4 = courseRepository.save(Course.create("데이터베이스 설계", "관계형 데이터베이스 설계와 SQL을 배웁니다.", 35));

        log.info("Created 4 courses");

        // 3. 차수 생성 (다양한 상태로)
        LocalDate today = LocalDate.now();

        // Java 기초 - 진행중
        CourseTerm term1 = createTerm(course1, 1, today.minusDays(10), today.plusDays(20),
                Set.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY), LocalTime.of(9, 0), LocalTime.of(12, 0), 30);
        setTermStatus(term1, TermStatus.ONGOING);
        courseTermRepository.save(term1);

        // Java 기초 - 예정
        CourseTerm term2 = createTerm(course1, 2, today.plusDays(30), today.plusDays(60),
                Set.of(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY), LocalTime.of(14, 0), LocalTime.of(17, 0), 30);
        courseTermRepository.save(term2);

        // Spring Boot - 진행중
        CourseTerm term3 = createTerm(course2, 1, today.minusDays(5), today.plusDays(25),
                Set.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY), LocalTime.of(10, 0), LocalTime.of(13, 0), 25);
        setTermStatus(term3, TermStatus.ONGOING);
        courseTermRepository.save(term3);

        // Spring Boot - 완료
        CourseTerm term4 = createTerm(course2, 2, today.minusDays(60), today.minusDays(30),
                Set.of(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY), LocalTime.of(9, 0), LocalTime.of(12, 0), 25);
        setTermStatus(term4, TermStatus.COMPLETED);
        courseTermRepository.save(term4);

        // React - 예정
        CourseTerm term5 = createTerm(course3, 1, today.plusDays(7), today.plusDays(37),
                Set.of(DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY), LocalTime.of(14, 0), LocalTime.of(17, 0), 20);
        courseTermRepository.save(term5);

        // React - 취소
        CourseTerm term6 = createTerm(course3, 2, today.plusDays(45), today.plusDays(75),
                Set.of(DayOfWeek.MONDAY), LocalTime.of(10, 0), LocalTime.of(13, 0), 20);
        setTermStatus(term6, TermStatus.CANCELLED);
        courseTermRepository.save(term6);

        // DB 설계 - 완료
        CourseTerm term7 = createTerm(course4, 1, today.minusDays(90), today.minusDays(60),
                Set.of(DayOfWeek.SATURDAY), LocalTime.of(9, 0), LocalTime.of(15, 0), 35);
        setTermStatus(term7, TermStatus.COMPLETED);
        courseTermRepository.save(term7);

        // DB 설계 - 예정
        CourseTerm term8 = createTerm(course4, 2, today.plusDays(14), today.plusDays(44),
                Set.of(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY), LocalTime.of(10, 0), LocalTime.of(16, 0), 35);
        courseTermRepository.save(term8);

        log.info("Created 8 course terms");

        // 4. 강사 배정
        InstructorAssignment ia1 = instructorAssignmentRepository.save(InstructorAssignment.create(term1, instructor1, operator));
        InstructorAssignment ia2 = instructorAssignmentRepository.save(InstructorAssignment.create(term2, instructor1, operator));
        InstructorAssignment ia3 = instructorAssignmentRepository.save(InstructorAssignment.create(term3, instructor2, operator));
        InstructorAssignment ia4 = instructorAssignmentRepository.save(InstructorAssignment.create(term4, instructor2, operator));
        InstructorAssignment ia5 = instructorAssignmentRepository.save(InstructorAssignment.create(term5, instructor3, operator));
        InstructorAssignment ia6 = instructorAssignmentRepository.save(InstructorAssignment.create(term7, instructor1, operator));
        InstructorAssignment ia7 = instructorAssignmentRepository.save(InstructorAssignment.create(term8, instructor3, operator));

        log.info("Created 7 instructor assignments");

        // IIS 데이터 생성 (강사 배정과 연동)
        iisRepository.save(InstructorInformationSystem.create(instructor1.getId(), term1.getId(), ia1));
        iisRepository.save(InstructorInformationSystem.create(instructor1.getId(), term2.getId(), ia2));
        iisRepository.save(InstructorInformationSystem.create(instructor2.getId(), term3.getId(), ia3));
        iisRepository.save(InstructorInformationSystem.create(instructor2.getId(), term4.getId(), ia4));
        iisRepository.save(InstructorInformationSystem.create(instructor3.getId(), term5.getId(), ia5));
        iisRepository.save(InstructorInformationSystem.create(instructor1.getId(), term7.getId(), ia6));
        iisRepository.save(InstructorInformationSystem.create(instructor3.getId(), term8.getId(), ia7));

        log.info("Created 7 IIS records");

        // 5. 강의 신청 (다양한 상태로)
        courseApplicationRepository.save(CourseApplication.create("파이썬 기초 강의", "파이썬 프로그래밍 기초 과정을 개설해주세요.", 25, student1));
        courseApplicationRepository.save(CourseApplication.create("클라우드 컴퓨팅", "AWS/Azure 기초 강의를 신청합니다.", 30, student2));

        CourseApplication app3 = CourseApplication.create("머신러닝 입문", "머신러닝 기초 과정 개설을 요청드립니다.", 20, student3);
        Course mlCourse = courseRepository.save(Course.create("머신러닝 입문", "머신러닝 기초를 배웁니다.", 20));
        app3.approve(mlCourse);
        courseApplicationRepository.save(app3);

        CourseApplication app4 = CourseApplication.create("게임 개발", "Unity 게임 개발 강의를 신청합니다.", 15, student4);
        app4.reject("현재 강사 수급이 어려워 개설이 어렵습니다.");
        courseApplicationRepository.save(app4);

        log.info("Created 4 course applications");

        // 6. 수강신청 (Enrollment) 및 SIS 데이터 생성
        // term1 (Java 기초 - 진행중) 수강생
        Enrollment e1 = enrollmentRepository.save(Enrollment.create(term1, student1));
        Enrollment e2 = enrollmentRepository.save(Enrollment.create(term1, student2));
        Enrollment e3 = enrollmentRepository.save(Enrollment.create(term1, student3));

        // term3 (Spring Boot - 진행중) 수강생
        Enrollment e4 = enrollmentRepository.save(Enrollment.create(term3, student2));
        Enrollment e5 = enrollmentRepository.save(Enrollment.create(term3, student4));

        // term4 (Spring Boot - 완료) 수강생 - 수료 처리
        Enrollment e6 = enrollmentRepository.save(Enrollment.create(term4, student1));
        e6.complete();
        enrollmentRepository.save(e6);

        Enrollment e7 = enrollmentRepository.save(Enrollment.create(term4, student3));
        e7.complete();
        enrollmentRepository.save(e7);

        // term7 (DB 설계 - 완료) 수강생 - 수료 처리
        Enrollment e8 = enrollmentRepository.save(Enrollment.create(term7, student2));
        e8.complete();
        enrollmentRepository.save(e8);

        Enrollment e9 = enrollmentRepository.save(Enrollment.create(term7, student5));
        e9.complete();
        enrollmentRepository.save(e9);

        // 취소된 수강
        Enrollment e10 = enrollmentRepository.save(Enrollment.create(term1, student4));
        e10.cancel();
        enrollmentRepository.save(e10);

        log.info("Created 10 enrollments");

        // SIS 데이터 생성 (수강신청과 연동)
        sisRepository.save(StudentInformationSystem.create(student1.getId(), term1.getId(), e1));
        sisRepository.save(StudentInformationSystem.create(student2.getId(), term1.getId(), e2));
        sisRepository.save(StudentInformationSystem.create(student3.getId(), term1.getId(), e3));
        sisRepository.save(StudentInformationSystem.create(student2.getId(), term3.getId(), e4));
        sisRepository.save(StudentInformationSystem.create(student4.getId(), term3.getId(), e5));
        sisRepository.save(StudentInformationSystem.create(student1.getId(), term4.getId(), e6));
        sisRepository.save(StudentInformationSystem.create(student3.getId(), term4.getId(), e7));
        sisRepository.save(StudentInformationSystem.create(student2.getId(), term7.getId(), e8));
        sisRepository.save(StudentInformationSystem.create(student5.getId(), term7.getId(), e9));
        sisRepository.save(StudentInformationSystem.create(student4.getId(), term1.getId(), e10));

        log.info("Created 10 SIS records");

        log.info("Test data creation completed!");
    }

    private User createUser(String email, String name, UserRole role) {
        String encodedPassword = passwordEncoder.encode("1q2w3e4r");
        User user = User.create(email, encodedPassword, name);
        setUserRole(user, role);
        return userRepository.save(user);
    }

    private CourseTerm createTerm(Course course, int termNumber, LocalDate startDate, LocalDate endDate,
                                   Set<DayOfWeek> daysOfWeek, LocalTime startTime, LocalTime endTime, int maxStudents) {
        return CourseTerm.create(course, termNumber, startDate, endDate, daysOfWeek, startTime, endTime, maxStudents);
    }

    private void setUserRole(User user, UserRole role) {
        try {
            java.lang.reflect.Field roleField = User.class.getDeclaredField("role");
            roleField.setAccessible(true);
            roleField.set(user, role);
        } catch (Exception e) {
            log.error("Failed to set role", e);
        }
    }

    private void setTermStatus(CourseTerm term, TermStatus status) {
        try {
            java.lang.reflect.Field statusField = CourseTerm.class.getDeclaredField("status");
            statusField.setAccessible(true);
            statusField.set(term, status);
        } catch (Exception e) {
            log.error("Failed to set term status", e);
        }
    }
}
