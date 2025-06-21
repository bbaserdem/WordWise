/**
 * @fileoverview Dashboard page component for authenticated users.
 *
 * This page serves as the main landing page for authenticated users,
 * providing an overview of their projects and quick access to key features.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/lib/auth/auth-guard';

/**
 * Dashboard page component.
 *
 * Displays the main dashboard for authenticated users with project
 * overview and quick access to key features.
 *
 * @returns The dashboard page component
 */
export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back, {user?.displayName || 'User'}!
            </h1>
            <p className="text-text-secondary mt-2">
              Ready to enhance your academic writing?
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="text-accent-error border-accent-error hover:bg-accent-error hover:text-white"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/dashboard/projects/new">
                <Button className="w-full" variant="default">
                  Create New Project
                </Button>
              </Link>
              <Link href="/dashboard/projects">
                <Button className="w-full" variant="outline">
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Your Profile
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-text-secondary">Name:</span>{' '}
                {user?.displayName || 'Not set'}
              </p>
              <p>
                <span className="font-medium text-text-secondary">Email:</span>{' '}
                {user?.email}
              </p>
              <p>
                <span className="font-medium text-text-secondary">Institution:</span>{' '}
                {user?.institution || 'Not set'}
              </p>
              <p>
                <span className="font-medium text-text-secondary">Field:</span>{' '}
                {user?.fieldOfStudy || 'Not set'}
              </p>
            </div>
            <Link href="/dashboard/profile" className="mt-4 inline-block">
              <Button variant="ghost" size="sm">
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Getting Started */}
          <div className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Getting Started
            </h3>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>1. Create your first project</p>
              <p>2. Add documents to your project</p>
              <p>3. Start writing with AI assistance</p>
              <p>4. Get real-time suggestions</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Recent Activity
          </h3>
          <p className="text-text-secondary">
            No recent activity. Start by creating your first project!
          </p>
        </div>
      </div>
    </AuthGuard>
  );
} 