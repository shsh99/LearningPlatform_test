package com.example.demo.global.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 양수 검증 어노테이션 (0 포함/제외 선택 가능)
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PositiveValidator.class)
public @interface ValidPositive {
    String message() default "값은 양수여야 합니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    /**
     * 0 허용 여부 (기본값: false)
     */
    boolean allowZero() default false;
}
