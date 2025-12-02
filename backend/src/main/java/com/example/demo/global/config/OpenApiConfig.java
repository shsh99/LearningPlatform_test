package com.example.demo.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

/**
 * OpenAPI (Swagger) 설정
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:MZRUN LMS API}")
    private String applicationName;

    @Bean
    public OpenAPI openAPI() {
        String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(apiInfo())
                .servers(servers())
                .tags(tags())
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT 액세스 토큰을 입력하세요. (Bearer 접두사 불필요)")
                        )
                );
    }

    private Info apiInfo() {
        return new Info()
                .title(applicationName)
                .description("""
                        ## MZRUN Learning Management System API

                        멀티테넌시 기반 B2B SaaS 학습 관리 시스템 REST API 문서입니다.

                        ### 주요 기능
                        - **인증**: JWT 기반 Access/Refresh Token 인증
                        - **사용자 관리**: 역할 기반 접근 제어 (SUPER_ADMIN, TENANT_ADMIN, INSTRUCTOR, STUDENT)
                        - **강의 관리**: 강의 생성, 차수 관리, 수강 신청
                        - **테넌트 관리**: 멀티테넌시 지원

                        ### 인증 방법
                        1. `/api/auth/login` 엔드포인트로 로그인하여 토큰 발급
                        2. 응답의 `accessToken`을 우측 상단 'Authorize' 버튼 클릭 후 입력
                        3. 토큰 만료 시 `/api/auth/refresh`로 갱신
                        """)
                .version("1.0.0")
                .contact(new Contact()
                        .name("MZRUN Dev Team")
                        .email("dev@mzrun.com")
                        .url("https://mzrun.com"))
                .license(new License()
                        .name("Private License")
                        .url("https://mzrun.com/license"));
    }

    private List<Server> servers() {
        return Arrays.asList(
                new Server()
                        .url("http://localhost:8080")
                        .description("Local Development Server"),
                new Server()
                        .url("https://api.mzrun.com")
                        .description("Production Server")
        );
    }

    private List<Tag> tags() {
        return Arrays.asList(
                new Tag().name("인증 (Auth)").description("로그인, 로그아웃, 토큰 갱신"),
                new Tag().name("사용자 (Users)").description("사용자 CRUD, 프로필 관리"),
                new Tag().name("강의 (Courses)").description("강의 CRUD, 승인/거부"),
                new Tag().name("차수 (Course Terms)").description("차수 CRUD, 상태 관리"),
                new Tag().name("수강신청 (Enrollments)").description("수강 신청, 취소, 완료"),
                new Tag().name("테넌트 (Tenants)").description("테넌트 관리 (슈퍼 관리자)"),
                new Tag().name("테넌트 신청 (Tenant Applications)").description("테넌트 가입 신청"),
                new Tag().name("강의 신청 (Course Applications)").description("강의 개설 신청"),
                new Tag().name("대시보드 (Dashboard)").description("통계 및 대시보드 데이터")
        );
    }
}
