package com.example.demo.global.email;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String token);
}
