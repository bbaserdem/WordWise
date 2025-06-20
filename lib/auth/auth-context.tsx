/**
 * @fileoverview Authentication context provider for the WordWise application.
 * 
 * This component provides authentication state management using Firebase Auth.
 * It handles user authentication, sign-in, sign-out, and user data management
 * throughout the application.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import type { User, AuthState, AuthError, AuthErrorType } from '@/types/auth';

/**
 * Authentication context interface.
 * 
 * @since 1.0.0
 */
interface AuthContextType extends AuthState {
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign up with email and password */
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Reset password for a user */
  resetPassword: (email: string) => Promise<void>;
  /** Update user profile */
  updateProfile: (data: Partial<User>) => Promise<void>;
  /** Clear any authentication errors */
  clearError: () => void;
}

/**
 * Authentication context for the application.
 * 
 * @since 1.0.0
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component props.
 * 
 * @since 1.0.0
 */
interface AuthProviderProps {
  /** Child components to wrap with authentication context */
  children: React.ReactNode;
}

/**
 * Authentication provider component.
 * 
 * This component provides authentication state and methods to all child components.
 * It manages user authentication state, handles Firebase Auth integration,
 * and provides user data management functionality.
 * 
 * @param children - Child components to wrap with authentication context
 * @returns The authentication provider with context
 * 
 * @since 1.0.0
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  /**
   * Convert Firebase user to application user format.
   * 
   * @param firebaseUser - Firebase user object
   * @returns Application user object
   * 
   * @since 1.0.0
   */
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      const { getFirebaseFirestore } = await import('@/lib/firebase/config');
      const firestore = getFirebaseFirestore();
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        const defaultUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          emailVerified: firebaseUser.emailVerified,
          role: 'student',
          preferences: {
            writingStyle: 'academic',
            citationFormat: 'apa',
            enableRealTimeSuggestions: true,
            enableAutoSave: true,
            autoSaveInterval: 30,
            enableDarkMode: false,
            enableNotifications: true,
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        await setDoc(doc(firestore, 'users', firebaseUser.uid), defaultUser);
        return defaultUser;
      }
    } catch (error) {
      throw new Error('Failed to load user data');
    }
  };

  /**
   * Sign in with email and password.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if sign-in fails
   * 
   * @since 1.0.0
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { getFirebaseAuth } = await import('@/lib/firebase/config');
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const authError: AuthError = {
        type: (err.code as AuthErrorType) || 'unknown',
        message: err.message || 'Sign-in failed',
        originalError: error,
      };
      setAuthState(prev => ({ ...prev, isLoading: false, error: authError.message }));
      throw authError;
    }
  };

  /**
   * Sign up with email and password.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @param userData - Additional user data
   * @throws Error if sign-up fails
   * 
   * @since 1.0.0
   */
  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { getFirebaseAuth, getFirebaseFirestore } = await import('@/lib/firebase/config');
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const auth = getFirebaseAuth();
      const firestore = getFirebaseFirestore();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: userData.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        emailVerified: firebaseUser.emailVerified,
        role: userData.role || 'student',
        institution: userData.institution,
        fieldOfStudy: userData.fieldOfStudy,
        academicLevel: userData.academicLevel,
        preferences: {
          writingStyle: 'academic',
          citationFormat: 'apa',
          enableRealTimeSuggestions: true,
          enableAutoSave: true,
          autoSaveInterval: 30,
          enableDarkMode: false,
          enableNotifications: true,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await setDoc(doc(firestore, 'users', firebaseUser.uid), newUser);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const authError: AuthError = {
        type: (err.code as AuthErrorType) || 'unknown',
        message: err.message || 'Sign-up failed',
        originalError: error,
      };
      setAuthState(prev => ({ ...prev, isLoading: false, error: authError.message }));
      throw authError;
    }
  };

  /**
   * Sign out the current user.
   * 
   * @throws Error if sign-out fails
   * 
   * @since 1.0.0
   */
  const signOut = async (): Promise<void> => {
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase/config');
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const authError: AuthError = {
        type: (err.code as AuthErrorType) || 'unknown',
        message: err.message || 'Sign-out failed',
        originalError: error,
      };
      setAuthState(prev => ({ ...prev, error: authError.message }));
      throw authError;
    }
  };

  /**
   * Reset password for a user.
   * 
   * @param email - User's email address
   * @throws Error if password reset fails
   * 
   * @since 1.0.0
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase/config');
      const { sendPasswordResetEmail } = await import('firebase/auth');
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const authError: AuthError = {
        type: (err.code as AuthErrorType) || 'unknown',
        message: err.message || 'Password reset failed',
        originalError: error,
      };
      throw authError;
    }
  };

  /**
   * Update user profile.
   * 
   * @param data - User data to update
   * @throws Error if profile update fails
   * 
   * @since 1.0.0
   */
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      if (!authState.user) {
        throw new Error('No user is signed in');
      }
      const { getFirebaseFirestore } = await import('@/lib/firebase/config');
      const firestore = getFirebaseFirestore();
      const userRef = doc(firestore, 'users', authState.user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data, updatedAt: Timestamp.now() } : null,
      }));
    } catch (error: unknown) {
      const err = error as { message?: string };
      const authError: AuthError = {
        type: 'unknown',
        message: err.message || 'Profile update failed',
        originalError: error,
      };
      throw authError;
    }
  };

  /**
   * Clear any authentication errors.
   * 
   * @since 1.0.0
   */
  const clearError = (): void => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // Set up authentication state listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const { getFirebaseAuth } = await import('@/lib/firebase/config');
      const { onAuthStateChanged } = await import('firebase/auth');
      const auth = getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            const user = await convertFirebaseUser(firebaseUser);
            setAuthState({
              user,
              isLoading: false,
              error: null,
              isAuthenticated: true,
            });
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              error: null,
              isAuthenticated: false,
            });
          }
        } catch {
          setAuthState({
            user: null,
            isLoading: false,
            error: 'Failed to load user data',
            isAuthenticated: false,
          });
        }
      });
    })();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context.
 * 
 * This hook provides access to the authentication context and ensures
 * it's used within the AuthProvider component.
 * 
 * @returns The authentication context
 * @throws Error if used outside of AuthProvider
 * 
 * @since 1.0.0
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 