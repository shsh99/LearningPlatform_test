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

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 20;

export function validateProfileName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
        errors.push('이름을 입력해주세요.');
        return { isValid: false, errors };
    }

    if (name.length < MIN_NAME_LENGTH) {
        errors.push('이름은 최소 2자 이상이어야 합니다.');
    }

    if (name.length > MAX_NAME_LENGTH) {
        errors.push('이름은 최대 20자까지 가능합니다.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validatePasswordChange(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
): ValidationResult {
    const errors: string[] = [];

    // 현재 비밀번호 확인
    if (!currentPassword || currentPassword.trim().length === 0) {
        errors.push('현재 비밀번호를 입력해주세요.');
    }

    // 새 비밀번호 검증
    if (!newPassword || newPassword.trim().length === 0) {
        errors.push('새 비밀번호를 입력해주세요.');
    } else {
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }
    }

    // 비밀번호 확인 검증
    if (!confirmPassword || confirmPassword.trim().length === 0) {
        errors.push('비밀번호 확인을 입력해주세요.');
    } else if (newPassword !== confirmPassword) {
        errors.push('새 비밀번호가 일치하지 않습니다.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
