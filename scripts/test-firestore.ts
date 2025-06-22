/**
 * @fileoverview Minimal Firestore write test script with authentication.
 *
 * This script authenticates as a test user and then tests Firestore
 * emulator connectivity and rules compliance.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Set NODE_ENV first
(process.env as any).NODE_ENV = process.env.NODE_ENV || 'development';

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

// Debug logging
console.log('🔍 Test Environment:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirestoreWrite() {
  try {
    console.log('\n🚀 Testing Firestore write with authentication...');
    
    // Initialize Firebase
    console.log('📱 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
    
    // Get Auth and Firestore instances
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // Connect to emulators
    console.log('🔗 Connecting to emulators...');
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Connected to emulators');
    
    // Sign in as test user
    console.log('🔐 Signing in as test user...');
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      'test@test.com', 
      '1234aoeu"<>P'
    );
    const user = userCredential.user;
    console.log('✅ Signed in successfully');
    console.log('  User ID:', user.uid);
    console.log('  Email:', user.email);
    
    // Create test project with the authenticated user's ID
    const testProject = {
      userId: user.uid,
      name: 'Test Project from Script',
      description: 'A test project created by the authenticated script.',
      type: 'research-paper',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    console.log('📝 Writing test project:', testProject);
    const docRef = await addDoc(collection(db, 'projects'), testProject);
    
    console.log('✅ Project written successfully!');
    console.log('  Document ID:', docRef.id);
    console.log('  Path:', docRef.path);
    
    return { success: true, docId: docRef.id, userId: user.uid };
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('  Error:', error);
    console.error('  Error name:', (error as any)?.name);
    console.error('  Error code:', (error as any)?.code);
    console.error('  Error message:', (error as any)?.message);
    
    return { success: false, error };
  }
}

// Run the test
testFirestoreWrite()
  .then((result) => {
    console.log('\n📊 Test Result:', result.success ? 'SUCCESS' : 'FAILED');
    if (result.success) {
      console.log('  User ID:', result.userId);
      console.log('  Document ID:', result.docId);
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  }); 