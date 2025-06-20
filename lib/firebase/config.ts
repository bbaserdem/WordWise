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
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Firebase configuration object.
 *
 * This contains the API keys and project settings for the Firebase project.
 * In production, these values should be set via environment variables.
 *
 * @since 1.0.0
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

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

  // Validate required configuration
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      'Firebase configuration is missing. Please check your environment variables.'
    );
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
async function configureEmulators(app: FirebaseApp): Promise<void> {
  try {
    const { connectAuthEmulator } = await import('firebase/auth');
    const { connectFirestoreEmulator } = await import('firebase/firestore');
    const { connectStorageEmulator } = await import('firebase/storage');
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const storage = getStorage(app);
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
  } catch (error: unknown) {
    // Optionally log error in development
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
  return getAuth(app);
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
  return getFirestore(app);
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
  return getStorage(app);
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

// Export the initialized instances for convenience
export const auth = getFirebaseAuth();
export const firestore = getFirebaseFirestore();
export const storage = getFirebaseStorage();
export const app = getFirebaseApp();
