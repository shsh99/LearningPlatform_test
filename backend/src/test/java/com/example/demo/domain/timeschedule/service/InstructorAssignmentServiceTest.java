package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.timeschedule.dto.AssignInstructorRequest;
import com.example.demo.domain.timeschedule.dto.InstructorAssignmentResponse;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;
import com.example.demo.domain.timeschedule.entity.InstructorAssignment;
import com.example.demo.domain.timeschedule.entity.InstructorInformationSystem;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.timeschedule.repository.InstructorInformationSystemRepository;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.repository.UserRepository;
import com.example.demo.domain.enrollment.entity.EnrollmentStatus;
import com.example.demo.domain.enrollment.repository.EnrollmentRepository;
import com.example.demo.global.exception.NotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class InstructorAssignmentServiceTest {

    @InjectMocks
    private InstructorAssignmentServiceImpl instructorAssignmentService;

    @Mock
    private InstructorAssignmentRepository assignmentRepository;

    @Mock
    private CourseTermRepository courseTermRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InstructorInformationSystemRepository iisRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Test
    @DisplayName("강사 배정")
    void assignInstructor() {
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

        User instructor = User.create("instructor@test.com", "password123!", "강사");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        AssignInstructorRequest request = new AssignInstructorRequest(1L, 2L, 3L);

        InstructorAssignment assignment = InstructorAssignment.create(term, instructor, assignedBy);

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(userRepository.findById(2L)).willReturn(Optional.of(instructor));
        given(userRepository.findById(3L)).willReturn(Optional.of(assignedBy));
        given(assignmentRepository.save(any(InstructorAssignment.class))).willReturn(assignment);
        given(iisRepository.save(any(InstructorInformationSystem.class))).willReturn(null);

        // when
        InstructorAssignmentResponse result = instructorAssignmentService.assignInstructor(request);

        // then
        assertThat(result).isNotNull();
        verify(courseTermRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(userRepository).findById(3L);
        verify(assignmentRepository).save(any(InstructorAssignment.class));
        verify(iisRepository).save(any(InstructorInformationSystem.class));
    }

    @Test
    @DisplayName("강사 배정 시 존재하지 않는 차수 예외")
    void assignInstructor_TermNotFound() {
        // given
        AssignInstructorRequest request = new AssignInstructorRequest(999L, 2L, 3L);
        given(courseTermRepository.findById(999L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> instructorAssignmentService.assignInstructor(request))
            .isInstanceOf(TermNotFoundException.class);
    }

    @Test
    @DisplayName("강사 배정 시 존재하지 않는 강사 예외")
    void assignInstructor_InstructorNotFound() {
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

        AssignInstructorRequest request = new AssignInstructorRequest(1L, 999L, 3L);

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(userRepository.findById(999L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> instructorAssignmentService.assignInstructor(request))
            .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("ID로 강사 배정 조회")
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

        User instructor = User.create("instructor@test.com", "password123!", "강사");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        InstructorAssignment assignment = InstructorAssignment.create(term, instructor, assignedBy);

        given(assignmentRepository.findById(1L)).willReturn(Optional.of(assignment));

        // when
        InstructorAssignmentResponse result = instructorAssignmentService.findById(1L);

        // then
        assertThat(result).isNotNull();
        verify(assignmentRepository).findById(1L);
    }

    @Test
    @DisplayName("차수 ID로 강사 배정 조회")
    void findByTermId() {
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

        User instructor1 = User.create("instructor1@test.com", "password123!", "강사1");
        User instructor2 = User.create("instructor2@test.com", "password123!", "강사2");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        List<InstructorAssignment> assignments = List.of(
            InstructorAssignment.create(term, instructor1, assignedBy),
            InstructorAssignment.create(term, instructor2, assignedBy)
        );

        given(courseTermRepository.findById(1L)).willReturn(Optional.of(term));
        given(assignmentRepository.findByTerm(term)).willReturn(assignments);

        // when
        List<InstructorAssignmentResponse> result = instructorAssignmentService.findByTermId(1L);

        // then
        assertThat(result).hasSize(2);
        verify(courseTermRepository).findById(1L);
        verify(assignmentRepository).findByTerm(term);
    }

    @Test
    @DisplayName("강사 ID로 강사 배정 조회")
    void findByInstructorId() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        CourseTerm term1 = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );
        CourseTerm term2 = CourseTerm.create(
            course,
            2,
            LocalDate.of(2025, 4, 1),
            LocalDate.of(2025, 6, 30),
            Set.of(DayOfWeek.TUESDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        User instructor = User.create("instructor@test.com", "password123!", "강사");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        List<InstructorAssignment> assignments = List.of(
            InstructorAssignment.create(term1, instructor, assignedBy),
            InstructorAssignment.create(term2, instructor, assignedBy)
        );

        given(userRepository.findById(1L)).willReturn(Optional.of(instructor));
        given(assignmentRepository.findByInstructor(instructor)).willReturn(assignments);

        // when
        List<InstructorAssignmentResponse> result = instructorAssignmentService.findByInstructorId(1L);

        // then
        assertThat(result).hasSize(2);
        verify(userRepository).findById(1L);
        verify(assignmentRepository).findByInstructor(instructor);
    }

    @Test
    @DisplayName("강사 스케줄 조회 - 특정 월")
    void findInstructorSchedule() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);

        // 2025년 1월 ~ 3월 차수
        CourseTerm term1 = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 3, 31),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        // 2025년 4월 ~ 6월 차수
        CourseTerm term2 = CourseTerm.create(
            course,
            2,
            LocalDate.of(2025, 4, 1),
            LocalDate.of(2025, 6, 30),
            Set.of(DayOfWeek.TUESDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        User instructor = User.create("instructor@test.com", "password123!", "강사");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        List<InstructorAssignment> assignments = List.of(
            InstructorAssignment.create(term1, instructor, assignedBy),
            InstructorAssignment.create(term2, instructor, assignedBy)
        );

        given(userRepository.findById(1L)).willReturn(Optional.of(instructor));
        given(assignmentRepository.findByInstructor(instructor)).willReturn(assignments);

        // when - 2025년 2월 조회 (term1만 포함되어야 함)
        List<InstructorAssignmentResponse> result = instructorAssignmentService.findInstructorSchedule(
            1L,
            YearMonth.of(2025, 2)
        );

        // then
        assertThat(result).hasSize(1);
        verify(userRepository).findById(1L);
        verify(assignmentRepository).findByInstructor(instructor);
    }

    @Test
    @DisplayName("강사 스케줄 조회 - 월 경계 포함")
    void findInstructorSchedule_CrossMonthBoundary() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);

        // 2025년 2월 15일 ~ 4월 15일 차수 (3개월에 걸쳐 있음)
        CourseTerm term = CourseTerm.create(
            course,
            1,
            LocalDate.of(2025, 2, 15),
            LocalDate.of(2025, 4, 15),
            Set.of(DayOfWeek.MONDAY),
            LocalTime.of(9, 0),
            LocalTime.of(18, 0),
            30
        );

        User instructor = User.create("instructor@test.com", "password123!", "강사");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        List<InstructorAssignment> assignments = List.of(
            InstructorAssignment.create(term, instructor, assignedBy)
        );

        given(userRepository.findById(1L)).willReturn(Optional.of(instructor));
        given(assignmentRepository.findByInstructor(instructor)).willReturn(assignments);

        // when - 2025년 3월 조회 (차수 기간에 포함되어야 함)
        List<InstructorAssignmentResponse> result = instructorAssignmentService.findInstructorSchedule(
            1L,
            YearMonth.of(2025, 3)
        );

        // then
        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("강사 스케줄 조회 - 해당 월에 배정 없음")
    void findInstructorSchedule_NoAssignments() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);

        // 2025년 1월 ~ 3월 차수
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

        User instructor = User.create("instructor@test.com", "password123!", "강사");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        List<InstructorAssignment> assignments = List.of(
            InstructorAssignment.create(term, instructor, assignedBy)
        );

        given(userRepository.findById(1L)).willReturn(Optional.of(instructor));
        given(assignmentRepository.findByInstructor(instructor)).willReturn(assignments);

        // when - 2025년 12월 조회 (차수 기간 이후)
        List<InstructorAssignmentResponse> result = instructorAssignmentService.findInstructorSchedule(
            1L,
            YearMonth.of(2025, 12)
        );

        // then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("강사 배정 취소")
    void cancelAssignment() {
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

        User instructor = User.create("instructor@test.com", "password123!", "강사");
        User assignedBy = User.create("operator@test.com", "password123!", "운영자");

        InstructorAssignment assignment = InstructorAssignment.create(term, instructor, assignedBy);

        given(assignmentRepository.findById(1L)).willReturn(Optional.of(assignment));
        given(enrollmentRepository.countByTermAndStatus(term, EnrollmentStatus.ENROLLED)).willReturn(0L);

        // when
        instructorAssignmentService.cancelAssignment(1L);

        // then
        verify(assignmentRepository).findById(1L);
        verify(enrollmentRepository).countByTermAndStatus(term, EnrollmentStatus.ENROLLED);
    }
}
