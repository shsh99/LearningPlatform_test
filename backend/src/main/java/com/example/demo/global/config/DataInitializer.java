package com.example.demo.global.config;

import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.entity.UserRole;
import com.example.demo.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 초기 데이터 생성
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // OPERATOR 계정이 없으면 생성
        if (!userRepository.existsByEmail("admin@admin.com")) {
            String encodedPassword = passwordEncoder.encode("1q2w3e4r");

            User operator = User.create("admin@admin.com", encodedPassword, "admin");
            // Reflection을 사용하거나 별도 메서드로 role 변경
            try {
                java.lang.reflect.Field roleField = User.class.getDeclaredField("role");
                roleField.setAccessible(true);
                roleField.set(operator, UserRole.OPERATOR);
            } catch (Exception e) {
                log.error("Failed to set OPERATOR role", e);
            }

            userRepository.save(operator);
            log.info("OPERATOR account created: admin@admin.com / 1q2w3e4r");
        } else {
            log.info("OPERATOR account already exists");
        }
    }
}
