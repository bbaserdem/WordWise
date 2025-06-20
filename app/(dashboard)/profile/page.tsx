/**
 * @fileoverview Profile page component for user account management.
 * 
 * This page displays user profile information and provides options
 * to update account settings. It will be enhanced with proper data
 * management and settings functionality in subsequent phases.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React from 'react';

/**
 * Profile page component.
 * 
 * Displays user profile information and account settings. This is a
 * placeholder that will be enhanced with proper data management and
 * settings functionality in subsequent phases.
 * 
 * @returns The profile page component
 */
export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Account Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Email Address
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Writing Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Academic Field
                </label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                  <option>Computer Science</option>
                  <option>Physics</option>
                  <option>Biology</option>
                  <option>Chemistry</option>
                  <option>Mathematics</option>
                  <option>Engineering</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Writing Style
                </label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                  <option>Formal Academic</option>
                  <option>Technical</option>
                  <option>Research Paper</option>
                  <option>Thesis</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 