package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.enrollment.entity.Enrollment;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.domain.timeschedule.dto.CourseTermDetailResponse;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.UpdateCourseTermRequest;
import com.example.demo.domain.timeschedule.entity.AssignmentStatus;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;

import java.util.Set;
import com.example.demo.domain.timeschedule.entity.TermStatus;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.global.exception.NotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CourseTermServiceTest {

    @InjectMocks
    private CourseTermServiceImpl courseTermService;

    @Mock
    private CourseTermRepository courseTermRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private InstructorAssignmentRepository instructorAssignmentRepository;

    @Test
    @DisplayName("차수 생성")
    void createTerm() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CreateCourseTermRequest request = new CreateCourseTermRequest(
            1L,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        CourseTerm term = CourseTerm.create(
            course,
            request.termNumber(),
            request.startDate(),
            request.endDate(),
            request.daysOfWeek(),
            request.startTime(),
            request.endTime(),
            request.maxStudents()
        );

        given(courseRepository.findById(1L)).willReturn(Optional.of(course));
        given(courseTermRepository.save(any(CourseTerm.class))).willReturn(term);

        // when
        CourseTermResponse result = courseTermService.createTerm(request);

        // then
        assertThat(result.termNumber()).isEqualTo(1);
        assertThat(result.daysOfWeek()).contains(DayOfWeek.MONDAY);
        assertThat(result.startTime()).isEqualTo(LocalTime.of(9, 0));
        assertThat(result.endTime()).isEqualTo(LocalTime.of(18, 0));
        assertThat(result.status()).isEqualTo(TermStatus.SCHEDULED);
        verify(courseRepository).findById(1L);
        verify(courseTermRepository).save(any(CourseTerm.class));
    }

    @Test
    @DisplayName("차수 생성 시 존재하지 않는 강의 예외")
    void createTerm_CourseNotFound() {
        // given
        CreateCourseTermRequest request = new CreateCourseTermRequest(
            999L,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );
        given(courseRepository.findById(999L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> courseTermService.createTerm(request))
            .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("차수 생성 시 날짜 검증 실패")
    void createTerm_InvalidDateRange() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CreateCourseTermRequest request = new CreateCourseTermRequest(
            1L,
            1,
            LocalDate.of(2025, 3, 31),
            LocalDate.of(2025, 1, 1),  // 종료일이 시작일보다 이전
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );
        given(courseRepository.findById(1L)).willReturn(Optional.of(course));

        // when & then
        assertThatThrownBy(() -> courseTermService.createTerm(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("종료일은 시작일 이후여야 합니다");
    }

    @Test
    @DisplayName("차수 생성 시 시간 검증 실패")
    void createTerm_InvalidTimeRange() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CreateCourseTermRequest request = new CreateCourseTermRequest(
            1L,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(18, 0),
            LocalTime.of(9, 0),  // 종료 시간이 시작 시간보다 이전
            30
        );
        given(courseRepository.findById(1L)).willReturn(Optional.of(course));

        // when & then
        assertThatThrownBy(() -> courseTermService.createTerm(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("종료 시간은 시작 시간 이후여야 합니다");
    }

    @Test
    @DisplayName("ID로 차수 조회")
    void findById() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );
        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));

        // when
        CourseTermResponse result = courseTermService.findById(1L);

        // then
        assertThat(result.termNumber()).isEqualTo(1);
        assertThat(result.daysOfWeek()).contains(DayOfWeek.MONDAY);
        verify(courseTermRepository).findById(1L);
    }

    @Test
    @DisplayName("존재하지 않는 차수 조회 시 예외")
    void findById_NotFound() {
        // given
        given(courseTermRepository.findById(1L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> courseTermService.findById(1L))
            .isInstanceOf(TermNotFoundException.class);
    }

    @Test
    @DisplayName("차수 수정")
    void updateTerm() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        UpdateCourseTermRequest request = new UpdateCourseTermRequest(
            LocalDate.of(2025, 2, 1),
            LocalDate.of(2025, 4, 30),
            Set.of(DayOfWeek.WEDNESDAY),
            LocalTime.of(10, 0),
            LocalTime.of(17, 0),
            25
        );

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));

        // when
        CourseTermResponse result = courseTermService.updateTerm(1L, request);

        // then
        assertThat(result.startDate()).isEqualTo(LocalDate.of(2025, 2, 1));
        assertThat(result.endDate()).isEqualTo(LocalDate.of(2025, 4, 30));
        assertThat(result.daysOfWeek()).contains(DayOfWeek.WEDNESDAY);
        assertThat(result.startTime()).isEqualTo(LocalTime.of(10, 0));
        assertThat(result.endTime()).isEqualTo(LocalTime.of(17, 0));
        assertThat(result.maxStudents()).isEqualTo(25);
    }

    @Test
    @DisplayName("차수 수정 시 날짜 검증 실패")
    void updateTerm_InvalidDateRange() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        UpdateCourseTermRequest request = new UpdateCourseTermRequest(
            LocalDate.of(2025, 4, 30),
            LocalDate.of(2025, 2, 1),  // 종료일이 시작일보다 이전
            Set.of(DayOfWeek.WEDNESDAY),
            LocalTime.of(10, 0),
            LocalTime.of(17, 0),
            25
        );

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));

        // when & then
        assertThatThrownBy(() -> courseTermService.updateTerm(1L, request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("종료일은 시작일 이후여야 합니다");
    }

    @Test
    @DisplayName("기간별 차수 검색")
    void searchByDateRange() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        List<CourseTerm> terms = List.of(
            CourseTerm.create(course, 1, LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31),
                Set.of(DayOfWeek.MONDAY), LocalTime.of(9, 0), LocalTime.of(18, 0), 30),
            CourseTerm.create(course, 2, LocalDate.of(2025, 4, 1), LocalDate.of(2025, 6, 30),
                Set.of(DayOfWeek.TUESDAY), LocalTime.of(9, 0), LocalTime.of(18, 0), 30)
        );

        given(courseTermRepository.findByStartDateBetween(
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 6, 30)
        )).willReturn(terms);

        // when
        List<CourseTermResponse> result = courseTermService.searchByDateRange(
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 6, 30)
        );

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).termNumber()).isEqualTo(1);
        assertThat(result.get(1).termNumber()).isEqualTo(2);
    }

    @Test
    @DisplayName("차수 복사")
    void duplicateTerm() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm originalTerm = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        List<CourseTerm> existingTerms = List.of(originalTerm);

        CourseTerm newTerm = CourseTerm.create(
            course,
            2,  // 다음 차수 번호
            LocalDate.of(2025, 4, 1),
            LocalDate.of(2025, 6, 30),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(originalTerm));
        given(courseTermRepository.findByCourse(course)).willReturn(existingTerms);
        given(courseTermRepository.save(any(CourseTerm.class))).willReturn(newTerm);

        // when
        CourseTermResponse result = courseTermService.duplicateTerm(
            1L,
            LocalDate.of(2025, 4, 1),
            LocalDate.of(2025, 6, 30)
        );

        // then
        assertThat(result.termNumber()).isEqualTo(2);
        assertThat(result.startDate()).isEqualTo(LocalDate.of(2025, 4, 1));
        assertThat(result.endDate()).isEqualTo(LocalDate.of(2025, 6, 30));
        assertThat(result.daysOfWeek()).contains(DayOfWeek.MONDAY);  // 원본과 동일
        assertThat(result.startTime()).isEqualTo(LocalTime.of(9, 0));  // 원본과 동일
        assertThat(result.endTime()).isEqualTo(LocalTime.of(18, 0));  // 원본과 동일
        verify(courseTermRepository).save(any(CourseTerm.class));
    }

    @Test
    @DisplayName("차수 복사 시 날짜 검증 실패")
    void duplicateTerm_InvalidDateRange() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm originalTerm = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(originalTerm));

        // when & then
        assertThatThrownBy(() -> courseTermService.duplicateTerm(
            1L,
            LocalDate.of(2025, 6, 30),
            LocalDate.of(2025, 4, 1)  // 종료일이 시작일보다 이전
        ))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("종료일은 시작일 이후여야 합니다");
    }

    @Test
    @DisplayName("차수 시작")
    void startTerm() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );
        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));

        // when
        courseTermService.startTerm(1L);

        // then
        verify(courseTermRepository).findById(1L);
    }

    @Test
    @DisplayName("차수 완료")
    void completeTerm() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );
        term.start();  // 시작 상태로 변경
        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));

        // when
        courseTermService.completeTerm(1L);

        // then
        verify(courseTermRepository).findById(1L);
    }

    @Test
    @DisplayName("차수 취소")
    void cancelTerm() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );
        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));

        // when
        courseTermService.cancelTerm(1L);

        // then
        verify(courseTermRepository).findById(1L);
    }

    @Test
    @DisplayName("차수 상세 조회 - 수강생과 강사 포함")
    void findDetailById_withEnrollmentsAndInstructor() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        User student1 = User.create("student1@test.com", "password", "홍길동", UserRole.STUDENT);
        User student2 = User.create("student2@test.com", "password", "김철수", UserRole.STUDENT);
        User instructor = User.create("instructor@test.com", "password", "강사님", UserRole.INSTRUCTOR);

        Enrollment enrollment1 = Enrollment.create(term, student1);
        Enrollment enrollment2 = Enrollment.create(term, student2);
        List<Enrollment> enrollments = List.of(enrollment1, enrollment2);

        InstructorAssignment assignment = InstructorAssignment.create(term, instructor, instructor);

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(enrollmentRepository.findByTerm(term)).willReturn(enrollments);
        given(instructorAssignmentRepository.findByTermAndStatus(term, AssignmentStatus.ASSIGNED))
            .willReturn(Optional.of(assignment));

        // when
        CourseTermDetailResponse result = courseTermService.findDetailById(1L);

        // then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(term.getId());
        assertThat(result.courseTitle()).isEqualTo("Spring Boot 입문");
        assertThat(result.termNumber()).isEqualTo(1);
        assertThat(result.enrolledStudents()).hasSize(2);
        assertThat(result.instructor()).isNotNull();
        assertThat(result.instructor().instructorName()).isEqualTo("강사님");
        assertThat(result.enrolledStudents().get(0).studentName()).isEqualTo("홍길동");
        assertThat(result.enrolledStudents().get(0).studentEmail()).contains("***"); // 이메일 마스킹 확인
        verify(courseTermRepository).findById(1L);
        verify(enrollmentRepository).findByTerm(term);
        verify(instructorAssignmentRepository).findByTermAndStatus(term, AssignmentStatus.ASSIGNED);
    }

    @Test
    @DisplayName("차수 상세 조회 - 강사 없음")
    void findDetailById_withoutInstructor() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        User student = User.create("student@test.com", "password", "홍길동", UserRole.STUDENT);
        Enrollment enrollment = Enrollment.create(term, student);

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(enrollmentRepository.findByTerm(term)).willReturn(List.of(enrollment));
        given(instructorAssignmentRepository.findByTermAndStatus(term, AssignmentStatus.ASSIGNED))
            .willReturn(Optional.empty());

        // when
        CourseTermDetailResponse result = courseTermService.findDetailById(1L);

        // then
        assertThat(result).isNotNull();
        assertThat(result.instructor()).isNull();
        assertThat(result.enrolledStudents()).hasSize(1);
        verify(instructorAssignmentRepository).findByTermAndStatus(term, AssignmentStatus.ASSIGNED);
    }

    @Test
    @DisplayName("차수 상세 조회 - 수강생 없음")
    void findDetailById_withoutEnrollments() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(enrollmentRepository.findByTerm(term)).willReturn(List.of());
        given(instructorAssignmentRepository.findByTermAndStatus(term, AssignmentStatus.ASSIGNED))
            .willReturn(Optional.empty());

        // when
        CourseTermDetailResponse result = courseTermService.findDetailById(1L);

        // then
        assertThat(result).isNotNull();
        assertThat(result.enrolledStudents()).isEmpty();
        assertThat(result.instructor()).isNull();
        verify(enrollmentRepository).findByTerm(term);
    }

    @Test
    @DisplayName("차수 상세 조회 - 취소된 수강생 제외")
    void findDetailById_excludeCancelledEnrollments() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        User student1 = User.create("enrolled@test.com", "password", "수강중학생", UserRole.STUDENT);
        User student2 = User.create("cancelled@test.com", "password", "취소학생", UserRole.STUDENT);
        User student3 = User.create("completed@test.com", "password", "완료학생", UserRole.STUDENT);

        Enrollment enrollment1 = Enrollment.create(term, student1); // ENROLLED
        Enrollment enrollment2 = Enrollment.create(term, student2);
        enrollment2.cancel(); // CANCELLED
        Enrollment enrollment3 = Enrollment.create(term, student3);
        enrollment3.complete(); // COMPLETED

        List<Enrollment> enrollments = List.of(enrollment1, enrollment2, enrollment3);

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(enrollmentRepository.findByTerm(term)).willReturn(enrollments);
        given(instructorAssignmentRepository.findByTermAndStatus(term, AssignmentStatus.ASSIGNED))
            .willReturn(Optional.empty());

        // when
        CourseTermDetailResponse result = courseTermService.findDetailById(1L);

        // then
        assertThat(result).isNotNull();
        assertThat(result.enrolledStudents()).hasSize(2); // ENROLLED + COMPLETED만 포함
        assertThat(result.enrolledStudents())
            .extracting("studentName")
            .containsExactlyInAnyOrder("수강중학생", "완료학생");
        assertThat(result.enrolledStudents())
            .extracting("status")
            .containsExactlyInAnyOrder(EnrollmentStatus.ENROLLED, EnrollmentStatus.COMPLETED);
    }

    @Test
    @DisplayName("차수 상세 조회 - 이메일 마스킹 확인")
    void findDetailById_emailMasking() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        User student1 = User.create("user@example.com", "password", "학생1", UserRole.STUDENT);
        User student2 = User.create("ab@test.com", "password", "학생2", UserRole.STUDENT);

        Enrollment enrollment1 = Enrollment.create(term, student1);
        Enrollment enrollment2 = Enrollment.create(term, student2);

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(enrollmentRepository.findByTerm(term)).willReturn(List.of(enrollment1, enrollment2));
        given(instructorAssignmentRepository.findByTermAndStatus(term, AssignmentStatus.ASSIGNED))
            .willReturn(Optional.empty());

        // when
        CourseTermDetailResponse result = courseTermService.findDetailById(1L);

        // then
        assertThat(result.enrolledStudents().get(0).studentEmail()).isEqualTo("use***@example.com");
        assertThat(result.enrolledStudents().get(1).studentEmail()).isEqualTo("a***@test.com");
    }

    @Test
    @DisplayName("차수 상세 조회 - 존재하지 않는 차수")
    void findDetailById_notFound() {
        // given
        given(courseTermRepository.findById(999L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> courseTermService.findDetailById(999L))
            .isInstanceOf(TermNotFoundException.class);
        verify(courseTermRepository).findById(999L);
    }
}
