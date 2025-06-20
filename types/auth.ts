/**
 * @fileoverview Authentication type definitions for the WordWise application.
 * 
 * This file defines TypeScript interfaces and types related to user
 * authentication, including user data structures, authentication
 * states, and form data types.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Represents a user in the WordWise application.
 * 
 * This interface defines the structure of user data stored in Firestore,
 * including basic profile information and metadata.
 * 
 * @since 1.0.0
 */
export interface User {
  /** Unique identifier for the user */
  uid: string;
  /** User's email address */
  email: string;
  /** User's display name */
  displayName?: string;
  /** User's profile photo URL */
  photoURL?: string;
  /** Whether the user's email is verified */
  emailVerified: boolean;
  /** User's role in the application */
  role: UserRole;
  /** User's academic institution */
  institution?: string;
  /** User's academic field of study */
  fieldOfStudy?: string;
  /** User's academic level */
  academicLevel?: AcademicLevel;
  /** User's writing preferences */
  preferences: UserPreferences;
  /** When the user account was created */
  createdAt: Timestamp;
  /** When the user account was last updated */
  updatedAt: Timestamp;
  /** When the user last signed in */
  lastSignInAt?: Timestamp;
}

/**
 * User roles in the application.
 * 
 * @since 1.0.0
 */
export type UserRole = 'student' | 'researcher' | 'professor' | 'admin';

/**
 * Academic levels for users.
 * 
 * @since 1.0.0
 */
export type AcademicLevel = 'undergraduate' | 'masters' | 'phd' | 'postdoc' | 'faculty';

/**
 * User preferences for writing and application settings.
 * 
 * @since 1.0.0
 */
export interface UserPreferences {
  /** Preferred writing style */
  writingStyle: WritingStyle;
  /** Preferred citation format */
  citationFormat: CitationFormat;
  /** Whether to enable real-time suggestions */
  enableRealTimeSuggestions: boolean;
  /** Whether to enable auto-save */
  enableAutoSave: boolean;
  /** Auto-save interval in seconds */
  autoSaveInterval: number;
  /** Whether to enable dark mode */
  enableDarkMode: boolean;
  /** Whether to enable notifications */
  enableNotifications: boolean;
  /** Language preference */
  language: string;
  /** Timezone */
  timezone: string;
}

/**
 * Writing style preferences.
 * 
 * @since 1.0.0
 */
export type WritingStyle = 'academic' | 'technical' | 'creative' | 'casual';

/**
 * Citation format preferences.
 * 
 * @since 1.0.0
 */
export type CitationFormat = 'apa' | 'mla' | 'chicago' | 'ieee' | 'harvard';

/**
 * Authentication state for the application.
 * 
 * @since 1.0.0
 */
export interface AuthState {
  /** Current user data */
  user: User | null;
  /** Whether authentication is being loaded */
  isLoading: boolean;
  /** Any authentication error */
  error: string | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Login form data structure.
 * 
 * @since 1.0.0
 */
export interface LoginFormData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Whether to remember the user */
  rememberMe: boolean;
}

/**
 * Registration form data structure.
 * 
 * @since 1.0.0
 */
export interface RegisterFormData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Password confirmation */
  confirmPassword: string;
  /** User's display name */
  displayName: string;
  /** User's academic institution */
  institution: string;
  /** User's field of study */
  fieldOfStudy: string;
  /** User's academic level */
  academicLevel: AcademicLevel;
  /** Whether to accept terms and conditions */
  acceptTerms: boolean;
  /** Whether to subscribe to newsletter */
  subscribeNewsletter: boolean;
}

/**
 * Password reset form data structure.
 * 
 * @since 1.0.0
 */
export interface PasswordResetFormData {
  /** User's email address */
  email: string;
}

/**
 * Profile update form data structure.
 * 
 * @since 1.0.0
 */
export interface ProfileUpdateFormData {
  /** User's display name */
  displayName: string;
  /** User's academic institution */
  institution: string;
  /** User's field of study */
  fieldOfStudy: string;
  /** User's academic level */
  academicLevel: AcademicLevel;
  /** User's photo URL */
  photoURL?: string;
}

/**
 * Authentication error types.
 * 
 * @since 1.0.0
 */
export type AuthErrorType = 
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/popup-closed-by-user'
  | 'auth/cancelled-popup-request'
  | 'auth/account-exists-with-different-credential'
  | 'auth/requires-recent-login'
  | 'auth/operation-not-allowed'
  | 'auth/invalid-credential'
  | 'unknown';

/**
 * Authentication error with additional context.
 * 
 * @since 1.0.0
 */
export interface AuthError {
  /** Error type/code */
  type: AuthErrorType;
  /** Human-readable error message */
  message: string;
  /** Original error object */
  originalError?: any;
} 