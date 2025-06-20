/**
 * @fileoverview Login page component for user authentication.
 * 
 * This page provides a form for users to log in to their WordWise account.
 * It will be enhanced with proper form handling and authentication logic
 * in subsequent phases.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React from 'react';

/**
 * Login page component.
 * 
 * Displays a login form for user authentication. This is a placeholder
 * that will be enhanced with proper form handling and Firebase Auth
 * integration in subsequent phases.
 * 
 * @returns The login page component
 */
export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary">Sign in to your account</h2>
        <p className="mt-2 text-text-secondary">
          Welcome back! Please sign in to continue.
        </p>
      </div>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Sign in
        </button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <a href="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
} 