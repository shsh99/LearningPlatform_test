package com.example.demo.global.config;

import com.example.demo.global.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/signup", "/api/auth/login", "/api/auth/refresh", "/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
                .requestMatchers("/api/auth/logout").authenticated()
                .requestMatchers("/h2-console/**").permitAll()
                // 테넌트 브랜딩/라벨 정보는 공개 (로그인 페이지에서도 테마 적용 필요)
                .requestMatchers("/api/tenant/branding", "/api/tenant/labels").permitAll()
                // 테넌트 코드 기반 공개 API (URL 기반 멀티테넌시)
                .requestMatchers("/api/public/tenant/**").permitAll()
                // 테넌트 신청 생성 (비회원 가능)
                .requestMatchers(HttpMethod.POST, "/api/tenant-applications").permitAll()
                // 테넌트 브랜딩/라벨/설정 수정 (SUPER_ADMIN, TENANT_ADMIN, OPERATOR, ADMIN)
                .requestMatchers("/api/tenants/{tenantId}/branding", "/api/tenants/{tenantId}/labels", "/api/tenants/{tenantId}/settings").hasAnyRole("SUPER_ADMIN", "TENANT_ADMIN", "OPERATOR", "ADMIN")
                // 테넌트 관리 API (SUPER_ADMIN만)
                .requestMatchers("/api/tenants/**").hasRole("SUPER_ADMIN")
                // 현재 테넌트 설정 조회 (인증된 사용자)
                .requestMatchers("/api/tenant/**").authenticated()
                .requestMatchers("/api/course-terms/**", "/api/instructor-assignments/**", "/api/student-information-system/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
