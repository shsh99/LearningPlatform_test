package com.example.demo.global.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 오늘 또는 미래 날짜 검증기
 */
public class FutureOrTodayValidator implements ConstraintValidator<FutureOrToday, Object> {

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // null은 @NotNull에서 처리
        }

        LocalDate today = LocalDate.now();

        if (value instanceof LocalDate date) {
            return !date.isBefore(today);
        } else if (value instanceof LocalDateTime dateTime) {
            return !dateTime.toLocalDate().isBefore(today);
        }

        return false;
    }
}
