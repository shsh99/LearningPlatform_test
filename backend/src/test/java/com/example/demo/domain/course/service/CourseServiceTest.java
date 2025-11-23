package com.example.demo.domain.course.service;

import com.example.demo.domain.course.dto.CourseResponse;
import com.example.demo.domain.course.dto.CreateCourseRequest;
import com.example.demo.domain.course.dto.UpdateCourseRequest;
import com.example.demo.domain.course.entity.Course;
import com.example.demo.domain.course.entity.CourseStatus;
import com.example.demo.domain.course.exception.CourseNotFoundException;
import com.example.demo.domain.course.repository.CourseRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @InjectMocks
    private CourseServiceImpl courseService;

    @Mock
    private CourseRepository courseRepository;

    @Test
    @DisplayName("강의 생성")
    void createCourse() {
        // given
        CreateCourseRequest request = new CreateCourseRequest(
            "Spring Boot 입문",
            "Spring Boot 기초부터 실습까지",
            30
        );
        Course course = Course.create(request.title(), request.description(), request.maxStudents());
        given(courseRepository.save(any(Course.class))).willReturn(course);

        // when
        CourseResponse result = courseService.create(request);

        // then
        assertThat(result.title()).isEqualTo("Spring Boot 입문");
        assertThat(result.maxStudents()).isEqualTo(30);
        assertThat(result.status()).isEqualTo(CourseStatus.APPROVED);
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    @DisplayName("ID로 강의 조회")
    void findById() {
        // given
        Course course = Course.create("Spring Boot 입문", "설명", 30);
        given(courseRepository.findById(1L)).willReturn(Optional.of(course));

        // when
        CourseResponse result = courseService.findById(1L);

        // then
        assertThat(result.title()).isEqualTo("Spring Boot 입문");
        verify(courseRepository).findById(1L);
    }

    @Test
    @DisplayName("존재하지 않는 강의 조회 시 예외")
    void findById_NotFound() {
        // given
        given(courseRepository.findById(1L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> courseService.findById(1L))
            .isInstanceOf(CourseNotFoundException.class);
    }

    @Test
    @DisplayName("전체 강의 목록 조회")
    void findAll() {
        // given
        List<Course> courses = List.of(
            Course.create("강의1", "설명1", 30),
            Course.create("강의2", "설명2", 20)
        );
        given(courseRepository.findAll()).willReturn(courses);

        // when
        List<CourseResponse> result = courseService.findAll();

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).title()).isEqualTo("강의1");
        assertThat(result.get(1).title()).isEqualTo("강의2");
    }

    @Test
    @DisplayName("상태별 강의 조회")
    void findByStatus() {
        // given
        List<Course> courses = List.of(
            Course.create("승인된 강의", "설명", 30)
        );
        given(courseRepository.findByStatus(CourseStatus.APPROVED)).willReturn(courses);

        // when
        List<CourseResponse> result = courseService.findByStatus(CourseStatus.APPROVED);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).status()).isEqualTo(CourseStatus.APPROVED);
    }

    @Test
    @DisplayName("강의 수정")
    void updateCourse() {
        // given
        Course course = Course.create("원래 제목", "원래 설명", 30);
        UpdateCourseRequest request = new UpdateCourseRequest("수정된 제목", "수정된 설명", 50);
        given(courseRepository.findById(1L)).willReturn(Optional.of(course));

        // when
        CourseResponse result = courseService.update(1L, request);

        // then
        assertThat(result.title()).isEqualTo("수정된 제목");
        assertThat(result.description()).isEqualTo("수정된 설명");
        assertThat(result.maxStudents()).isEqualTo(50);
    }

    @Test
    @DisplayName("강의 삭제")
    void deleteCourse() {
        // given
        Course course = Course.create("삭제할 강의", "설명", 30);
        given(courseRepository.findById(1L)).willReturn(Optional.of(course));

        // when
        courseService.delete(1L);

        // then
        verify(courseRepository).delete(course);
    }

    @Test
    @DisplayName("강의 승인")
    void approveCourse() {
        // given
        Course course = Course.create("강의", "설명", 30);
        given(courseRepository.findById(1L)).willReturn(Optional.of(course));

        // when
        CourseResponse result = courseService.approve(1L);

        // then
        assertThat(result.status()).isEqualTo(CourseStatus.APPROVED);
    }

    @Test
    @DisplayName("강의 거부")
    void rejectCourse() {
        // given
        Course course = Course.create("강의", "설명", 30);
        given(courseRepository.findById(1L)).willReturn(Optional.of(course));

        // when
        CourseResponse result = courseService.reject(1L);

        // then
        assertThat(result.status()).isEqualTo(CourseStatus.REJECTED);
    }
}
