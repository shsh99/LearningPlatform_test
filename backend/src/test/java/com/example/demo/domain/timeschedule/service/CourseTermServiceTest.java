package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.repository.CourseRepository;
import com.example.demo.domain.timeschedule.dto.CourseTermResponse;
import com.example.demo.domain.timeschedule.dto.CreateCourseTermRequest;
import com.example.demo.domain.timeschedule.dto.UpdateCourseTermRequest;
import com.example.demo.domain.timeschedule.entity.CourseTerm;
import com.example.demo.domain.timeschedule.entity.DayOfWeek;

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
}
