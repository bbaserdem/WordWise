/**
 * @fileoverview Validation utilities for form validation.
 *
 * This file provides validation functions for various form fields,
 * including email, password, and other common input types.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

/**
 * Email validation regex pattern.
 *
 * @since 1.0.0
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password validation regex patterns.
 *
 * @since 1.0.0
 */
const PASSWORD_PATTERNS = {
  minLength: /.{8,}/,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
} as const;

/**
 * Validates an email address.
 *
 * @param email - Email address to validate
 * @returns True if email is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid-email'); // false
 * ```
 *
 * @since 1.0.0
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates a password against security requirements.
 *
 * @param password - Password to validate
 * @returns Object with validation results
 *
 * @example
 * ```typescript
 * const result = validatePassword('MyPassword123!');
 * console.log(result.isValid); // true
 * console.log(result.errors); // []
 * ```
 *
 * @since 1.0.0
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!PASSWORD_PATTERNS.minLength.test(password)) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!PASSWORD_PATTERNS.hasUppercase.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!PASSWORD_PATTERNS.hasLowercase.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!PASSWORD_PATTERNS.hasNumber.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!PASSWORD_PATTERNS.hasSpecialChar.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that two passwords match.
 *
 * @param password - First password
 * @param confirmPassword - Second password to compare
 * @returns True if passwords match, false otherwise
 *
 * @since 1.0.0
 */
export function passwordsMatch(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword;
}

/**
 * Validates a display name.
 *
 * @param displayName - Display name to validate
 * @returns Object with validation results
 *
 * @since 1.0.0
 */
export function validateDisplayName(displayName: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!displayName.trim()) {
    errors.push('Display name is required');
  } else if (displayName.trim().length < 2) {
    errors.push('Display name must be at least 2 characters long');
  } else if (displayName.trim().length > 50) {
    errors.push('Display name must be less than 50 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates required fields.
 *
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message if invalid, null if valid
 *
 * @since 1.0.0
 */
export function validateRequired(
  value: string,
  fieldName: string
): string | null {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validates terms acceptance.
 *
 * @param accepted - Whether terms were accepted
 * @returns Error message if not accepted, null if accepted
 *
 * @since 1.0.0
 */
export function validateTermsAcceptance(accepted: boolean): string | null {
  if (!accepted) {
    return 'You must accept the terms and conditions';
  }
  return null;
} 