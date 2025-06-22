/**
 * @fileoverview Script to fix document projectId for imported documents.
 *
 * This script updates all documents for the test user to ensure they have the correct
 * projectId, linking them to the intended test project. This is useful if documents
 * were imported before the projectId was set correctly.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Set NODE_ENV first
(process.env as any).NODE_ENV = process.env.NODE_ENV || 'development';

import { config } from 'dotenv';

// Load environment variables from .env files
config({ path: '.env.local' });
config({ path: '.env' });

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc, connectFirestoreEmulator, query, where } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Test user credentials for authentication.
 *
 * @since 1.0.0
 */
const TEST_USER_CREDENTIALS = {
  email: 'test@test.com',
  password: '1234aoeu"<>P',
};

/**
 * Name of the test project to link documents to.
 *
 * @since 1.0.0
 */
const TEST_PROJECT_NAME = 'Neural Networks Research Project';

/**
 * Fix document projectId for all documents of the test user.
 *
 * This function finds the test project and updates all documents for the test user
 * to have the correct projectId.
 *
 * @since 1.0.0
 */
async function fixDocumentProjectIds() {
  try {
    console.log('🔧 Starting document projectId fix...');

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
    
    // Sign in as test user
    console.log('🔐 Signing in as test user...');
    const userCredential = await signInWithEmailAndPassword(
      auth,
      TEST_USER_CREDENTIALS.email,
      TEST_USER_CREDENTIALS.password
    );
    const user = userCredential.user;
    console.log('✅ Signed in successfully');
    console.log('  User ID:', user.uid);
    console.log('  Email:', user.email);

    // Find the test project for this user
    console.log(`🔍 Looking for project named "${TEST_PROJECT_NAME}"...`);
    const projectsRef = collection(db, 'projects');
    const projectQuery = query(projectsRef, where('userId', '==', user.uid), where('name', '==', TEST_PROJECT_NAME));
    const projectSnap = await getDocs(projectQuery);
    if (projectSnap.empty) {
      console.error(`❌ No project found with name "${TEST_PROJECT_NAME}" for user.`);
      return;
    }
    const projectDoc = projectSnap.docs[0];
    const projectId = projectDoc.id;
    console.log(`✅ Found project: ${projectDoc.data().name} (${projectId})`);

    // Get all documents for this user
    console.log('📄 Fetching documents for user...');
    const documentsRef = collection(db, 'documents');
    const docsQuery = query(documentsRef, where('userId', '==', user.uid));
    const docsSnap = await getDocs(docsQuery);
    const docs = docsSnap.docs;
    console.log(`📊 Found ${docs.length} documents for user`);

    let fixedCount = 0;
    let skippedCount = 0;

    // Update each document's projectId if needed
    for (const docSnap of docs) {
      const data = docSnap.data();
      if (data.projectId !== projectId) {
        await updateDoc(doc(db, 'documents', docSnap.id), { projectId });
        console.log(`  ✅ Fixed document: ${data.title || docSnap.id}`);
        fixedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log('🎉 Document projectId fix completed!');
    console.log(`📊 Summary:`);
    console.log(`  Documents checked: ${docs.length}`);
    console.log(`  Documents fixed: ${fixedCount}`);
    console.log(`  Documents skipped: ${skippedCount}`);

  } catch (error) {
    console.error('❌ Document projectId fix failed:', error);
    throw error;
  }
}

/**
 * Main function to run the fix script.
 *
 * @since 1.0.0
 */
async function main() {
  console.log('🔧 WordWise Document ProjectId Fix Script');
  console.log('========================================');

  // Run the fix
  await fixDocumentProjectIds();
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { fixDocumentProjectIds }; 