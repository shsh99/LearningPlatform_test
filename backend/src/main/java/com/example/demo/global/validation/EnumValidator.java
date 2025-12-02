package com.example.demo.global.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Enum 값 검증기
 * 문자열이 지정된 Enum의 유효한 값인지 검증합니다.
 */
public class EnumValidator implements ConstraintValidator<ValidEnum, String> {

    private Set<String> acceptedValues;
    private boolean ignoreCase;
    private boolean allowNull;

    @Override
    public void initialize(ValidEnum constraintAnnotation) {
        this.ignoreCase = constraintAnnotation.ignoreCase();
        this.allowNull = constraintAnnotation.allowNull();

        Enum<?>[] enumConstants = constraintAnnotation.enumClass().getEnumConstants();
        if (ignoreCase) {
            this.acceptedValues = Arrays.stream(enumConstants)
                .map(e -> e.name().toUpperCase())
                .collect(Collectors.toSet());
        } else {
            this.acceptedValues = Arrays.stream(enumConstants)
                .map(Enum::name)
                .collect(Collectors.toSet());
        }
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return allowNull;
        }

        String checkValue = ignoreCase ? value.toUpperCase() : value;
        return acceptedValues.contains(checkValue);
    }
}
