package com.example.demo.global.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * 양수 검증기
 */
public class PositiveValidator implements ConstraintValidator<ValidPositive, Number> {

    private boolean allowZero;

    @Override
    public void initialize(ValidPositive constraintAnnotation) {
        this.allowZero = constraintAnnotation.allowZero();
    }

    @Override
    public boolean isValid(Number value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // null은 @NotNull에서 처리
        }

        double doubleValue = value.doubleValue();

        if (allowZero) {
            return doubleValue >= 0;
        } else {
            return doubleValue > 0;
        }
    }
}
