/**
 * @fileoverview Script to create a demo user account in Firebase Auth emulator.
 *
 * This script creates a demo user account in the Firebase Auth emulator
 * for development and testing purposes.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration (should match your .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Demo user data for development and testing.
 *
 * @since 1.0.0
 */
const DEMO_USER_DATA = {
  email: 'demo@wordwise.com',
  password: 'demo123456',
  displayName: 'Demo User',
};

/**
 * Create demo user in Firebase Auth and Firestore.
 *
 * @since 1.0.0
 */
async function createDemoUser() {
  try {
    console.log('🚀 Creating demo user...');

    // Initialize Firebase
    console.log('📱 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // Connect to emulators
    console.log('🔗 Connecting to emulators...');
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Connected to emulators');

    // Create user in Auth
    console.log('🔐 Creating user in Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      DEMO_USER_DATA.email,
      DEMO_USER_DATA.password
    );
    const user = userCredential.user;
    console.log('✅ User created in Auth');
    console.log('  User ID:', user.uid);
    console.log('  Email:', user.email);

    // Create user document in Firestore using the actual authenticated user's UID
    console.log('📄 Creating user document in Firestore...');
    const userDoc = {
      uid: user.uid, // Use the actual authenticated user's UID
      email: DEMO_USER_DATA.email,
      displayName: DEMO_USER_DATA.displayName,
      photoURL: '',
      emailVerified: true,
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

    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log('✅ User document created in Firestore');

    console.log('\n🎉 Demo user created successfully!');
    console.log('📋 Demo user credentials:');
    console.log(`  Email: ${DEMO_USER_DATA.email}`);
    console.log(`  Password: ${DEMO_USER_DATA.password}`);
    console.log(`  UID: ${user.uid}`);
    console.log('\n💡 You can now sign in with these credentials in the app.');
    console.log('\n📝 IMPORTANT: Update the DEMO_USER_ID in the server component:');
    console.log(`   File: app/dashboard/projects/[projectId]/page.tsx`);
    console.log(`   Change: const DEMO_USER_ID = '${user.uid}';`);

  } catch (error) {
    console.error('❌ Failed to create demo user:', error);
    
    if (error instanceof Error) {
      // Check if user already exists
      if (error.message.includes('auth/email-already-in-use')) {
        console.log('ℹ️  Demo user already exists. You can sign in with:');
        console.log(`  Email: ${DEMO_USER_DATA.email}`);
        console.log(`  Password: ${DEMO_USER_DATA.password}`);
        console.log('\n💡 To get the user ID, sign in to the app and check the console.');
      } else {
        console.error('Error details:', error.message);
      }
    }
    
    process.exit(1);
  }
}

/**
 * Main function.
 *
 * @since 1.0.0
 */
async function main() {
  console.log('🔧 WordWise Demo User Creation Script');
  console.log('=====================================\n');

  // Check if emulators are running
  console.log('⚠️  Make sure Firebase emulators are running:');
  console.log('   npm run emulators\n');

  await createDemoUser();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
} 