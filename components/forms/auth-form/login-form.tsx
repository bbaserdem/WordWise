/**
 * @fileoverview Login form component for user authentication.
 *
 * This component provides a form for users to log in to their WordWise account.
 * It includes form validation, error handling, and integration with the
 * authentication system.
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
import { isValidEmail, validateRequired } from '@/lib/utils/validation';
import type { LoginFormData } from '@/types/auth';

/**
 * Login form component props.
 *
 * @since 1.0.0
 */
interface LoginFormProps {
  /** Callback when login is successful */
  onSuccess?: () => void;
  /** Callback when user wants to go to registration */
  onGoToRegister?: () => void;
  /** Callback when user wants to reset password */
  onForgotPassword?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Login form component.
 *
 * This component renders a login form with email and password fields,
 * validation, error handling, and integration with Firebase Auth.
 *
 * @param onSuccess - Callback when login is successful
 * @param onGoToRegister - Callback when user wants to go to registration
 * @param onForgotPassword - Callback when user wants to reset password
 * @param className - Additional CSS classes
 * @returns Login form component
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onSuccess={() => router.push('/dashboard')}
 *   onGoToRegister={() => router.push('/register')}
 *   onForgotPassword={() => router.push('/forgot-password')}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function LoginForm({
  onSuccess,
  onGoToRegister,
  onForgotPassword,
  className,
}: LoginFormProps) {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  /**
   * Handle form input changes.
   *
   * @param e - Input change event
   * @since 1.0.0
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = e.target;
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
    const errors: { email?: string; password?: string } = {};

    // Validate email
    const emailError = validateRequired(formData.email, 'Email');
    if (emailError) {
      errors.email = emailError;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    const passwordError = validateRequired(formData.password, 'Password');
    if (passwordError) {
      errors.password = passwordError;
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
      await signIn(formData.email, formData.password);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Sign in to your account
        </h2>
        <p className="mt-2 text-text-secondary">
          Welcome back! Please sign in to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Enter your password"
            hasError={!!validationErrors.password}
            errorMessage={validationErrors.password}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
              disabled={isLoading}
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-text-secondary"
            >
              Remember me
            </label>
          </div>

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary-600 hover:text-primary-500"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          )}
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
          loadingText="Signing in..."
          disabled={isLoading}
        >
          Sign in
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          {onGoToRegister ? (
            <button
              type="button"
              onClick={onGoToRegister}
              className="font-medium text-primary-600 hover:text-primary-500"
              disabled={isLoading}
            >
              Sign up
            </button>
          ) : (
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up
            </Link>
          )}
        </p>
      </div>
    </div>
  );
} 