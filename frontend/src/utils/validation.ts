export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;
const SPECIAL_CHAR_PATTERN = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/;

export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!password || password.trim().length === 0) {
        errors.push('비밀번호를 입력해주세요.');
        return { isValid: false, errors };
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
        errors.push('비밀번호는 최대 20자까지 가능합니다.');
    }

    if (!SPECIAL_CHAR_PATTERN.test(password)) {
        errors.push('비밀번호에 특수문자(!@#$%^&*()_+-=[]{}|;:,.<>?)를 포함해야 합니다.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validatePasswordConfirm(password: string, passwordConfirm: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!passwordConfirm || passwordConfirm.trim().length === 0) {
        errors.push('비밀번호 확인을 입력해주세요.');
        return { isValid: false, errors };
    }

    if (password !== passwordConfirm) {
        errors.push('비밀번호가 일치하지 않습니다.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function getPasswordHelperText(): string {
    return '8-20자, 특수문자 포함';
}
