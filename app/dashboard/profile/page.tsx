/**
 * @fileoverview User profile page component.
 *
 * This page allows users to view and edit their profile information,
 * including personal details and preferences.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AcademicLevel } from '@/types/auth';

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
 * Profile page component.
 *
 * Displays user profile information and allows editing of basic details.
 *
 * @returns The profile page component
 */
export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    institution: user?.institution || '',
    fieldOfStudy: user?.fieldOfStudy || '',
    academicLevel: user?.academicLevel || 'undergraduate' as AcademicLevel,
  });

  /**
   * Handle form input changes.
   *
   * @param e - Input change event
   * @since 1.0.0
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  /**
   * Handle cancel editing.
   *
   * @since 1.0.0
   */
  const handleCancel = (): void => {
    setFormData({
      displayName: user?.displayName || '',
      institution: user?.institution || '',
      fieldOfStudy: user?.fieldOfStudy || '',
      academicLevel: user?.academicLevel || 'undergraduate',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            disabled={isLoading}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-text-primary"
              >
                Full Name
              </label>
              <Input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-background-secondary"
              />
              <p className="text-xs text-text-tertiary mt-1">
                Email cannot be changed
              </p>
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
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="fieldOfStudy"
                className="block text-sm font-medium text-text-primary"
              >
                Field of Study
              </label>
              <Input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleInputChange}
                placeholder="Enter your field of study"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="academicLevel"
                className="block text-sm font-medium text-text-primary"
              >
                Academic Level
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

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Saving..."
                disabled={isLoading}
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Full Name
              </label>
              <p className="mt-1 text-text-primary">
                {user?.displayName || 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Email
              </label>
              <p className="mt-1 text-text-primary">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Institution
              </label>
              <p className="mt-1 text-text-primary">
                {user?.institution || 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Field of Study
              </label>
              <p className="mt-1 text-text-primary">
                {user?.fieldOfStudy || 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Academic Level
              </label>
              <p className="mt-1 text-text-primary">
                {ACADEMIC_LEVEL_OPTIONS.find(
                  option => option.value === user?.academicLevel
                )?.label || 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Member Since
              </label>
              <p className="mt-1 text-text-primary">
                {user?.createdAt
                  ? new Date(user.createdAt.toDate()).toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 