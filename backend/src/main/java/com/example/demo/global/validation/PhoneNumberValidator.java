package com.example.demo.global.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * 전화번호 형식 검증기
 * 한국 전화번호 형식을 검증합니다.
 */
public class PhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {

    // 한국 전화번호 패턴: 휴대폰(010, 011, 016, 017, 018, 019) 및 지역번호
    private static final String PHONE_PATTERN =
        "^(01[016789]-?\\d{3,4}-?\\d{4}|0[2-9][0-9]?-?\\d{3,4}-?\\d{4})$";

    private boolean allowEmpty;

    @Override
    public void initialize(ValidPhoneNumber constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return allowEmpty;
        }
        // 하이픈 제거 후 검증
        String normalized = phoneNumber.replaceAll("-", "");
        return phoneNumber.matches(PHONE_PATTERN) || normalized.matches("^01[016789]\\d{7,8}$|^0[2-9][0-9]?\\d{6,8}$");
    }
}
