package com.example.demo.global.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Enum 값 검증 어노테이션
 * 문자열이 지정된 Enum의 유효한 값인지 검증합니다.
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EnumValidator.class)
public @interface ValidEnum {
    String message() default "유효하지 않은 값입니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    Class<? extends Enum<?>> enumClass();
    boolean ignoreCase() default true;
    boolean allowNull() default false;
}
