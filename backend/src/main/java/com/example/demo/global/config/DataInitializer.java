package com.example.demo.global.config;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.courseapplication.entity.CourseApplication;
import com.example.demo.domain.courseapplication.repository.CourseApplicationRepository;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
    private final CourseApplicationRepository courseApplicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // OPERATOR 계정이 없으면 생성
        User operator;
        if (!userRepository.existsByEmail("admin@admin.com")) {
            String encodedPassword = passwordEncoder.encode("1q2w3e4r");

            operator = User.create("admin@admin.com", encodedPassword, "admin");
            setUserRole(operator, UserRole.OPERATOR);
            userRepository.save(operator);
            log.info("OPERATOR account created: admin@admin.com / 1q2w3e4r");
        } else {
            operator = userRepository.findByEmail("admin@admin.com").orElse(null);
            log.info("OPERATOR account already exists");
        }

        // 테스트 데이터 생성 (한 번만)
        if (courseRepository.count() == 0) {
            createTestData(operator);
        }
    }

    private void createTestData(User operator) {
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
        instructorAssignmentRepository.save(InstructorAssignment.create(term1, instructor1, operator));
        instructorAssignmentRepository.save(InstructorAssignment.create(term2, instructor1, operator));
        instructorAssignmentRepository.save(InstructorAssignment.create(term3, instructor2, operator));
        instructorAssignmentRepository.save(InstructorAssignment.create(term4, instructor2, operator));
        instructorAssignmentRepository.save(InstructorAssignment.create(term5, instructor3, operator));
        instructorAssignmentRepository.save(InstructorAssignment.create(term7, instructor1, operator));
        instructorAssignmentRepository.save(InstructorAssignment.create(term8, instructor3, operator));

        log.info("Created 7 instructor assignments");

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
