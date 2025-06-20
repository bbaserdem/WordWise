/**
 * @fileoverview Authentication guard component for route protection.
 *
 * This component protects routes that require authentication by checking
 * the user's authentication state and redirecting unauthenticated users
 * to the login page.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';

/**
 * Authentication guard component props.
 *
 * @since 1.0.0
 */
interface AuthGuardProps {
  /** Child components to render if authenticated */
  children: React.ReactNode;
  /** Redirect path for unauthenticated users */
  redirectTo?: string;
  /** Whether to show loading state while checking authentication */
  showLoading?: boolean;
  /** Loading component to display */
  loadingComponent?: React.ReactNode;
}

/**
 * Authentication guard component.
 *
 * This component protects routes by checking if the user is authenticated.
 * If not authenticated, it redirects to the login page. It also handles
 * loading states while checking authentication.
 *
 * @param children - Child components to render if authenticated
 * @param redirectTo - Redirect path for unauthenticated users
 * @param showLoading - Whether to show loading state
 * @param loadingComponent - Custom loading component
 * @returns Protected content or loading state
 *
 * @example
 * ```tsx
 * <AuthGuard redirectTo="/login">
 *   <Dashboard />
 * </AuthGuard>
 * ```
 *
 * @since 1.0.0
 */
export function AuthGuard({
  children,
  redirectTo = '/login',
  showLoading = true,
  loadingComponent,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading && showLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
} 