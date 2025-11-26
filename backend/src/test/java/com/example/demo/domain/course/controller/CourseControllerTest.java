package com.example.demo.domain.course.controller;

import com.example.demo.domain.course.dto.CourseResponse;
import com.example.demo.domain.course.entity.CourseStatus;
import com.example.demo.domain.course.service.CourseService;
import com.example.demo.global.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.example.demo.config.TestSecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CourseController.class,
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE,
        classes = JwtAuthenticationFilter.class))
@Import(TestSecurityConfig.class)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @Test
    @DisplayName("강의 생성")
    @WithMockUser(roles = "OPERATOR")
    void createCourse() throws Exception {
        // given
        CourseResponse response = new CourseResponse(
            1L,
            "Spring Boot 입문",
            "Spring Boot 기초부터 실습까지",
            30,
            CourseStatus.APPROVED,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        given(courseService.create(any())).willReturn(response);

        // when & then
        mockMvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "Spring Boot 입문",
                      "description": "Spring Boot 기초부터 실습까지",
                      "maxStudents": 30
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.title").value("Spring Boot 입문"))
            .andExpect(jsonPath("$.maxStudents").value(30));
    }

    @Test
    @DisplayName("강의 단건 조회")
    void getCourseById() throws Exception {
        // given
        CourseResponse response = new CourseResponse(
            1L,
            "Spring Boot 입문",
            "설명",
            30,
            CourseStatus.APPROVED,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        given(courseService.findById(1L)).willReturn(response);

        // when & then
        mockMvc.perform(get("/api/courses/1")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.title").value("Spring Boot 입문"));
    }

    @Test
    @DisplayName("전체 강의 목록 조회")
    void getAllCourses() throws Exception {
        // given
        List<CourseResponse> courses = List.of(
            new CourseResponse(1L, "강의1", "설명1", 30, CourseStatus.APPROVED, LocalDateTime.now(), LocalDateTime.now()),
            new CourseResponse(2L, "강의2", "설명2", 20, CourseStatus.APPROVED, LocalDateTime.now(), LocalDateTime.now())
        );
        given(courseService.findAll()).willReturn(courses);

        // when & then
        mockMvc.perform(get("/api/courses")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[1].id").value(2L));
    }

    @Test
    @DisplayName("상태별 강의 조회")
    void getCoursesByStatus() throws Exception {
        // given
        List<CourseResponse> courses = List.of(
            new CourseResponse(1L, "승인된 강의", "설명", 30, CourseStatus.APPROVED, LocalDateTime.now(), LocalDateTime.now())
        );
        given(courseService.findByStatus(CourseStatus.APPROVED)).willReturn(courses);

        // when & then
        mockMvc.perform(get("/api/courses/status/APPROVED")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].status").value("APPROVED"));
    }

    @Test
    @DisplayName("강의 제목으로 검색")
    void searchCourses() throws Exception {
        // given
        List<CourseResponse> courses = List.of(
            new CourseResponse(1L, "Spring Boot", "설명", 30, CourseStatus.APPROVED, LocalDateTime.now(), LocalDateTime.now())
        );
        given(courseService.searchByTitle("Spring")).willReturn(courses);

        // when & then
        mockMvc.perform(get("/api/courses/search")
                .param("keyword", "Spring")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Spring Boot"));
    }

    @Test
    @DisplayName("강의 수정")
    @WithMockUser(roles = "OPERATOR")
    void updateCourse() throws Exception {
        // given
        CourseResponse response = new CourseResponse(
            1L,
            "수정된 제목",
            "수정된 설명",
            50,
            CourseStatus.APPROVED,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        given(courseService.update(eq(1L), any())).willReturn(response);

        // when & then
        mockMvc.perform(patch("/api/courses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "수정된 제목",
                      "description": "수정된 설명",
                      "maxStudents": 50
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("수정된 제목"))
            .andExpect(jsonPath("$.maxStudents").value(50));
    }

    @Test
    @DisplayName("강의 삭제")
    @WithMockUser(roles = "ADMIN")
    void deleteCourse() throws Exception {
        // when & then
        mockMvc.perform(delete("/api/courses/1"))
            .andExpect(status().isNoContent());

        verify(courseService).delete(1L);
    }

    @Test
    @DisplayName("강의 승인")
    @WithMockUser(roles = "OPERATOR")
    void approveCourse() throws Exception {
        // given
        CourseResponse response = new CourseResponse(
            1L,
            "강의",
            "설명",
            30,
            CourseStatus.APPROVED,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        given(courseService.approve(1L)).willReturn(response);

        // when & then
        mockMvc.perform(post("/api/courses/1/approve"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    @DisplayName("강의 거부")
    @WithMockUser(roles = "OPERATOR")
    void rejectCourse() throws Exception {
        // given
        CourseResponse response = new CourseResponse(
            1L,
            "강의",
            "설명",
            30,
            CourseStatus.REJECTED,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        given(courseService.reject(1L)).willReturn(response);

        // when & then
        mockMvc.perform(post("/api/courses/1/reject"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("REJECTED"));
    }

    @Test
    @DisplayName("Validation 실패 - 제목 누락")
    @WithMockUser(roles = "OPERATOR")
    void createCourse_ValidationFailed() throws Exception {
        // when & then
        mockMvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "description": "설명만 있음",
                      "maxStudents": 30
                    }
                    """))
            .andExpect(status().isBadRequest());
    }
}
