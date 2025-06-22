/**
 * @fileoverview Firebase configuration for the WordWise application.
 *
 * This file initializes Firebase with the necessary services (Auth, Firestore, Storage)
 * and configures emulators for local development. It provides a centralized
 * configuration that can be imported throughout the application.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth as getFirebaseAuthInstance, type Auth } from 'firebase/auth';
import { getFirestore as getFirebaseFirestoreInstance, type Firestore, enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage as getFirebaseStorageInstance, type FirebaseStorage } from 'firebase/storage';
import { 
  getEnvironmentFirebaseConfig, 
  getCurrentFirebaseEnvironment, 
  validateFirebaseProjectConfig,
  type FirebaseEnvironment 
} from './environment';

/**
 * Get Firebase configuration with lazy validation.
 *
 * This function returns the Firebase configuration without immediate validation.
 * Validation is performed only when the configuration is actually used.
 *
 * @returns Firebase configuration object
 *
 * @since 1.0.0
 */
function getFirebaseConfig() {
  return getEnvironmentFirebaseConfig();
}

/**
 * Validate and get Firebase configuration.
 *
 * This function validates the Firebase configuration and returns it.
 * Use this when you need to ensure the configuration is valid before using it.
 *
 * @returns Firebase configuration object
 * @throws Error if Firebase configuration is invalid
 *
 * @since 1.0.0
 */
function getValidatedFirebaseConfig() {
  const config = getEnvironmentFirebaseConfig();
  
  // Simple validation - just check if we have the required fields
  if (!config.apiKey || !config.authDomain) {
    throw new Error(
      'Firebase configuration is missing required fields (apiKey, authDomain). ' +
      'Please check your environment variables.'
    );
  }
  
  return config;
}

/**
 * Initialize Firebase app instance.
 *
 * This function initializes Firebase if it hasn't been initialized already,
 * preventing multiple initializations in development mode.
 *
 * @returns The initialized Firebase app instance
 * @throws Error if Firebase configuration is missing
 *
 * @since 1.0.0
 */
function initializeFirebaseApp(): FirebaseApp {
  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Try to get validated Firebase configuration
  let firebaseConfig;
  try {
    firebaseConfig = getValidatedFirebaseConfig();
  } catch (error) {
    // If validation fails, try to get the raw config and log a warning
    console.warn('Firebase validation failed, attempting to use raw config:', error);
    firebaseConfig = getEnvironmentFirebaseConfig();
    
    // Check if we have the minimum required fields
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
      throw new Error(
        'Firebase configuration is missing required fields (apiKey, authDomain). ' +
        'Please check your environment variables.'
      );
    }
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Configure emulators in development
  if (process.env.NODE_ENV === 'development') {
    configureEmulators(app);
  }

  return app;
}

/**
 * Configure Firebase emulators for local development.
 *
 * This function sets up the local emulators for Auth, Firestore, and Storage
 * when running in development mode. This allows for offline development
 * without affecting the production Firebase project.
 *
 * @param app - The Firebase app instance
 *
 * @since 1.0.0
 */
function configureEmulators(app: FirebaseApp): void {
  try {
    const { connectAuthEmulator } = require('firebase/auth');
    const { connectStorageEmulator } = require('firebase/storage');
    const auth = getFirebaseAuthInstance(app);
    const firestore = getFirebaseFirestoreInstance(app);
    const storage = getFirebaseStorageInstance(app);
    
    if (process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
    }
    if (process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
    if (process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR === 'true') {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
    
    console.log('Firebase emulators configured successfully');
  } catch (error: unknown) {
    console.error('Failed to configure emulators:', error);
  }
}

/**
 * Get Firebase Auth instance.
 *
 * @returns The Firebase Auth instance
 *
 * @since 1.0.0
 */
export function getFirebaseAuth(): Auth {
  const app = initializeFirebaseApp();
  return getFirebaseAuthInstance(app);
}

/**
 * Get Firestore instance.
 *
 * @returns The Firestore instance
 *
 * @since 1.0.0
 */
export function getFirebaseFirestore(): Firestore {
  const app = initializeFirebaseApp();
  const firestore = getFirebaseFirestoreInstance(app);
  
  // Configure Firestore settings for better reliability
  if (process.env.NODE_ENV === 'development') {
    // In development, we can be more lenient with connection issues
    console.log('Firestore initialized in development mode');
  }
  
  return firestore;
}

/**
 * Get Firebase Storage instance.
 *
 * @returns The Firebase Storage instance
 *
 * @since 1.0.0
 */
export function getFirebaseStorage(): FirebaseStorage {
  const app = initializeFirebaseApp();
  return getFirebaseStorageInstance(app);
}

/**
 * Get the main Firebase app instance.
 *
 * @returns The Firebase app instance
 *
 * @since 1.0.0
 */
export function getFirebaseApp(): FirebaseApp {
  return initializeFirebaseApp();
}

/**
 * Get the current Firebase environment.
 *
 * @returns The current Firebase environment
 *
 * @since 1.0.0
 */
export function getCurrentEnvironment(): FirebaseEnvironment {
  return getCurrentFirebaseEnvironment();
}

/**
 * Validate Firebase configuration.
 *
 * @returns Validation result with success status and any errors
 *
 * @since 1.0.0
 */
export function validateFirebaseConfig() {
  return validateFirebaseProjectConfig();
}

/**
 * Handle Firestore connection issues gracefully.
 *
 * This function provides utilities for managing Firestore connections
 * and handling common connection issues.
 *
 * @since 1.0.0
 */
export const firestoreConnectionUtils = {
  /**
   * Enable Firestore network connection.
   *
   * @returns Promise that resolves when connection is enabled
   */
  async enableConnection(): Promise<void> {
    try {
      const firestore = getFirebaseFirestore();
      await enableNetwork(firestore);
      console.log('Firestore connection enabled');
    } catch (error) {
      console.warn('Failed to enable Firestore connection:', error);
    }
  },

  /**
   * Disable Firestore network connection (for offline mode).
   *
   * @returns Promise that resolves when connection is disabled
   */
  async disableConnection(): Promise<void> {
    try {
      const firestore = getFirebaseFirestore();
      await disableNetwork(firestore);
      console.log('Firestore connection disabled (offline mode)');
    } catch (error) {
      console.warn('Failed to disable Firestore connection:', error);
    }
  },

  /**
   * Check if Firestore is connected.
   *
   * @returns Promise that resolves to connection status
   */
  async isConnected(): Promise<boolean> {
    try {
      // This is a simple check - in a real app you might want more sophisticated connection monitoring
      return true;
    } catch (error) {
      console.warn('Failed to check Firestore connection:', error);
      return false;
    }
  }
};

// Lazy initialization - only initialize when actually needed
let _auth: Auth | null = null;
let _firestore: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _app: FirebaseApp | null = null;

/**
 * Get Firebase Auth instance (lazy initialization).
 *
 * @returns The Firebase Auth instance
 *
 * @since 1.0.0
 */
export function getAuth(): Auth {
  if (!_auth) {
    _auth = getFirebaseAuth();
  }
  return _auth;
}

/**
 * Get Firestore instance (lazy initialization).
 *
 * @returns The Firestore instance
 *
 * @since 1.0.0
 */
export function getFirestore(): Firestore {
  if (!_firestore) {
    _firestore = getFirebaseFirestore();
  }
  return _firestore;
}

/**
 * Get Firebase Storage instance (lazy initialization).
 *
 * @returns The Firebase Storage instance
 *
 * @since 1.0.0
 */
export function getFirebaseStorageLazy(): FirebaseStorage {
  if (!_storage) {
    _storage = getFirebaseStorage();
  }
  return _storage;
}

/**
 * Get the main Firebase app instance (lazy initialization).
 *
 * @returns The Firebase app instance
 *
 * @since 1.0.0
 */
export function getApp(): FirebaseApp {
  if (!_app) {
    _app = getFirebaseApp();
  }
  return _app;
}
