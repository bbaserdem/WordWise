/**
 * @fileoverview Registration form component for new user signup.
 *
 * This component provides a form for new users to create a WordWise account.
 * It includes comprehensive form validation, error handling, and integration
 * with the authentication system.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks';
import {
  isValidEmail,
  validatePassword,
  passwordsMatch,
  validateDisplayName,
  validateRequired,
  validateTermsAcceptance,
} from '@/lib/utils/validation';
import type { RegisterFormData, AcademicLevel } from '@/types/auth';

/**
 * Registration form component props.
 *
 * @since 1.0.0
 */
interface RegisterFormProps {
  /** Callback when registration is successful */
  onSuccess?: () => void;
  /** Callback when user wants to go to login */
  onGoToLogin?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Academic level options for the select dropdown.
 *
 * @since 1.0.0
 */
const ACADEMIC_LEVEL_OPTIONS: { value: AcademicLevel; label: string }[] = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'masters', label: 'Master\'s' },
  { value: 'phd', label: 'PhD' },
  { value: 'postdoc', label: 'Postdoctoral' },
  { value: 'faculty', label: 'Faculty' },
];

/**
 * Registration form component.
 *
 * This component renders a registration form with all necessary fields
 * for creating a new user account, including validation and error handling.
 *
 * @param onSuccess - Callback when registration is successful
 * @param onGoToLogin - Callback when user wants to go to login
 * @param className - Additional CSS classes
 * @returns Registration form component
 *
 * @example
 * ```tsx
 * <RegisterForm
 *   onSuccess={() => router.push('/dashboard')}
 *   onGoToLogin={() => router.push('/login')}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function RegisterForm({
  onSuccess,
  onGoToLogin,
  className,
}: RegisterFormProps) {
  const { signUp, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    institution: '',
    fieldOfStudy: '',
    academicLevel: 'undergraduate',
    acceptTerms: false,
    subscribeNewsletter: false,
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
    institution?: string;
    fieldOfStudy?: string;
    acceptTerms?: string;
  }>({});

  /**
   * Handle form input changes.
   *
   * @param e - Input change event
   * @since 1.0.0
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear auth errors when user starts typing
    if (error) {
      clearError();
    }
  };

  /**
   * Validate form data.
   *
   * @returns True if form is valid, false otherwise
   * @since 1.0.0
   */
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validate email
    const emailError = validateRequired(formData.email, 'Email');
    if (emailError) {
      errors.email = emailError;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    // Validate password confirmation
    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate display name
    const displayNameValidation = validateDisplayName(formData.displayName);
    if (!displayNameValidation.isValid) {
      errors.displayName = displayNameValidation.errors[0];
    }

    // Validate institution
    const institutionError = validateRequired(formData.institution, 'Institution');
    if (institutionError) {
      errors.institution = institutionError;
    }

    // Validate field of study
    const fieldOfStudyError = validateRequired(formData.fieldOfStudy, 'Field of study');
    if (fieldOfStudyError) {
      errors.fieldOfStudy = fieldOfStudyError;
    }

    // Validate terms acceptance
    const termsError = validateTermsAcceptance(formData.acceptTerms);
    if (termsError) {
      errors.acceptTerms = termsError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission.
   *
   * @param e - Form submit event
   * @since 1.0.0
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signUp(formData.email, formData.password, {
        displayName: formData.displayName,
        institution: formData.institution,
        fieldOfStudy: formData.fieldOfStudy,
        academicLevel: formData.academicLevel,
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Create your account
        </h2>
        <p className="mt-2 text-text-secondary">
          Join WordWise to enhance your academic writing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-text-primary"
          >
            Full name
          </label>
          <Input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            hasError={!!validationErrors.displayName}
            errorMessage={validationErrors.displayName}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary"
          >
            Email address
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            hasError={!!validationErrors.email}
            errorMessage={validationErrors.email}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="institution"
            className="block text-sm font-medium text-text-primary"
          >
            Institution
          </label>
          <Input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            placeholder="Enter your institution"
            hasError={!!validationErrors.institution}
            errorMessage={validationErrors.institution}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="fieldOfStudy"
            className="block text-sm font-medium text-text-primary"
          >
            Field of study
          </label>
          <Input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleInputChange}
            placeholder="Enter your field of study"
            hasError={!!validationErrors.fieldOfStudy}
            errorMessage={validationErrors.fieldOfStudy}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="academicLevel"
            className="block text-sm font-medium text-text-primary"
          >
            Academic level
          </label>
          <select
            id="academicLevel"
            name="academicLevel"
            value={formData.academicLevel}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-primary-200 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-background-primary text-text-primary"
            disabled={isLoading}
          >
            {ACADEMIC_LEVEL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-primary"
          >
            Password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            hasError={!!validationErrors.password}
            errorMessage={validationErrors.password}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-text-primary"
          >
            Confirm password
          </label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            hasError={!!validationErrors.confirmPassword}
            errorMessage={validationErrors.confirmPassword}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded mt-1"
              disabled={isLoading}
            />
            <label
              htmlFor="acceptTerms"
              className="ml-2 block text-sm text-text-secondary"
            >
              I accept the{' '}
              <Link
                href="/terms"
                className="text-primary-600 hover:text-primary-500"
                target="_blank"
              >
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-primary-600 hover:text-primary-500"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {validationErrors.acceptTerms && (
            <p className="text-sm text-accent-error ml-6">
              {validationErrors.acceptTerms}
            </p>
          )}

          <div className="flex items-start">
            <input
              id="subscribeNewsletter"
              name="subscribeNewsletter"
              type="checkbox"
              checked={formData.subscribeNewsletter}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded mt-1"
              disabled={isLoading}
            />
            <label
              htmlFor="subscribeNewsletter"
              className="ml-2 block text-sm text-text-secondary"
            >
              Subscribe to our newsletter for updates and tips
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-accent-error/10 border border-accent-error/20 p-3">
            <p className="text-sm text-accent-error">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          loadingText="Creating account..."
          disabled={isLoading}
        >
          Create account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          {onGoToLogin ? (
            <button
              type="button"
              onClick={onGoToLogin}
              className="font-medium text-primary-600 hover:text-primary-500"
              disabled={isLoading}
            >
              Sign in
            </button>
          ) : (
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          )}
        </p>
      </div>
    </div>
  );
} 