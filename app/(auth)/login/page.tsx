/**
 * @fileoverview Login page component for user authentication.
 * 
 * This page provides a form for users to log in to their WordWise account.
 * It uses the LoginForm component with proper authentication integration.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/forms/auth-form';
import { useAuth } from '@/hooks';

/**
 * Login page component.
 * 
 * Displays a login form for user authentication. If the user is already
 * authenticated, they are redirected to the dashboard.
 * 
 * @returns The login page component
 */
export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary">WordWise</h1>
          <p className="mt-2 text-text-secondary">
            Your AI-powered academic writing assistant
          </p>
        </div>
        
        <LoginForm
          onSuccess={() => router.push('/dashboard')}
          onGoToRegister={() => router.push('/register')}
          onForgotPassword={() => router.push('/forgot-password')}
        />
      </div>
    </div>
  );
} 