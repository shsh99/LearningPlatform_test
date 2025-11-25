package com.example.demo.global.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Primary
@Slf4j
public class ConsoleEmailService implements EmailService {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = frontendUrl + "/reset-password/" + token;

        log.info("\n" +
                "=".repeat(80) + "\n" +
                "📧 비밀번호 재설정 이메일 (콘솔 출력 모드)\n" +
                "=".repeat(80) + "\n" +
                "받는 사람: {}\n" +
                "제목: [LearningPlatform] 비밀번호 재설정 요청\n" +
                "-".repeat(80) + "\n" +
                "안녕하세요,\n\n" +
                "비밀번호 재설정을 요청하셨습니다.\n" +
                "아래 링크를 클릭하여 새 비밀번호를 설정해주세요.\n\n" +
                "재설정 링크: {}\n\n" +
                "이 링크는 1시간 동안 유효합니다.\n" +
                "요청하지 않으신 경우 이 메일을 무시하셔도 됩니다.\n\n" +
                "감사합니다.\n" +
                "=".repeat(80),
                toEmail, resetUrl);
    }
}
