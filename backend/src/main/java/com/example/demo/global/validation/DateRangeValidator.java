package com.example.demo.global.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 날짜 범위 검증기
 * 시작일이 종료일보다 이전인지 검증합니다.
 */
public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {

    private String startDateField;
    private String endDateField;
    private boolean allowEqual;

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        this.startDateField = constraintAnnotation.startDateField();
        this.endDateField = constraintAnnotation.endDateField();
        this.allowEqual = constraintAnnotation.allowEqual();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        BeanWrapper beanWrapper = new BeanWrapperImpl(value);
        Object startValue = beanWrapper.getPropertyValue(startDateField);
        Object endValue = beanWrapper.getPropertyValue(endDateField);

        // null 값은 다른 어노테이션(@NotNull)에서 처리
        if (startValue == null || endValue == null) {
            return true;
        }

        int comparison = compareTemporals(startValue, endValue);

        if (allowEqual) {
            return comparison <= 0;
        } else {
            return comparison < 0;
        }
    }

    private int compareTemporals(Object start, Object end) {
        if (start instanceof LocalDate startDate && end instanceof LocalDate endDate) {
            return startDate.compareTo(endDate);
        } else if (start instanceof LocalDateTime startDateTime && end instanceof LocalDateTime endDateTime) {
            return startDateTime.compareTo(endDateTime);
        }
        throw new IllegalArgumentException("지원하지 않는 날짜 타입입니다.");
    }
}
