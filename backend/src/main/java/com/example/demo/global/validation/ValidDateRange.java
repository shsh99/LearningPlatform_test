package com.example.demo.global.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 날짜 범위 검증 어노테이션 (클래스 레벨)
 * 시작일이 종료일보다 이전인지 검증합니다.
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
public @interface ValidDateRange {
    String message() default "시작일은 종료일보다 이전이어야 합니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String startDateField();
    String endDateField();

    /**
     * 동일 날짜 허용 여부
     */
    boolean allowEqual() default true;
}
