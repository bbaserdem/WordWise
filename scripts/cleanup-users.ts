/**
 * @fileoverview Script to cleanup users and update document ownership.
 *
 * This script deletes old users and updates all documents to belong to
 * the new demo user for development and testing purposes.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

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
 * Demo user credentials.
 *
 * @since 1.0.0
 */
const DEMO_USER_CREDENTIALS = {
  email: 'demo@wordwise.com',
  password: 'demo123456',
};

/**
 * Old user ID to be deleted.
 *
 * @since 1.0.0
 */
const OLD_USER_ID = 'AP0A5ukLdTFFy6SnwWdR8zFuwB0O';

/**
 * Cleanup users and update document ownership.
 *
 * @since 1.0.0
 */
async function cleanupUsers() {
  try {
    console.log('🚀 Starting user cleanup...');

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

    // Sign in as demo user
    console.log('🔐 Signing in as demo user...');
    const userCredential = await signInWithEmailAndPassword(
      auth,
      DEMO_USER_CREDENTIALS.email,
      DEMO_USER_CREDENTIALS.password
    );
    const demoUser = userCredential.user;
    console.log('✅ Signed in successfully');
    console.log('  Demo User ID:', demoUser.uid);

    // Get all projects for the old user
    console.log('📁 Finding projects for old user...');
    const projectsQuery = query(collection(db, 'projects'), where('userId', '==', OLD_USER_ID));
    const projectsSnapshot = await getDocs(projectsQuery);
    const oldProjects = projectsSnapshot.docs;
    console.log(`  Found ${oldProjects.length} projects for old user`);

    // Update projects to belong to demo user
    console.log('🔄 Updating project ownership...');
    for (const projectDoc of oldProjects) {
      await updateDoc(projectDoc.ref, {
        userId: demoUser.uid,
        updatedAt: new Date(),
      });
      console.log(`  Updated project: ${projectDoc.data().name}`);
    }

    // Get all documents for the old user
    console.log('📄 Finding documents for old user...');
    const documentsQuery = query(collection(db, 'documents'), where('userId', '==', OLD_USER_ID));
    const documentsSnapshot = await getDocs(documentsQuery);
    const oldDocuments = documentsSnapshot.docs;
    console.log(`  Found ${oldDocuments.length} documents for old user`);

    // Update documents to belong to demo user
    console.log('🔄 Updating document ownership...');
    for (const documentDoc of oldDocuments) {
      await updateDoc(documentDoc.ref, {
        userId: demoUser.uid,
        updatedAt: new Date(),
      });
      console.log(`  Updated document: ${documentDoc.data().title}`);
    }

    // Get all document versions for the old user
    console.log('📚 Finding document versions for old user...');
    const versionsQuery = query(collection(db, 'documentVersions'), where('userId', '==', OLD_USER_ID));
    const versionsSnapshot = await getDocs(versionsQuery);
    const oldVersions = versionsSnapshot.docs;
    console.log(`  Found ${oldVersions.length} document versions for old user`);

    // Update document versions to belong to demo user
    console.log('🔄 Updating document version ownership...');
    for (const versionDoc of oldVersions) {
      await updateDoc(versionDoc.ref, {
        userId: demoUser.uid,
        updatedAt: new Date(),
      });
      console.log(`  Updated document version: ${versionDoc.id}`);
    }

    // Get all suggestions for the old user
    console.log('💡 Finding suggestions for old user...');
    const suggestionsQuery = query(collection(db, 'suggestions'), where('userId', '==', OLD_USER_ID));
    const suggestionsSnapshot = await getDocs(suggestionsQuery);
    const oldSuggestions = suggestionsSnapshot.docs;
    console.log(`  Found ${oldSuggestions.length} suggestions for old user`);

    // Update suggestions to belong to demo user
    console.log('🔄 Updating suggestion ownership...');
    for (const suggestionDoc of oldSuggestions) {
      await updateDoc(suggestionDoc.ref, {
        userId: demoUser.uid,
        updatedAt: new Date(),
      });
      console.log(`  Updated suggestion: ${suggestionDoc.id}`);
    }

    // Delete the old user document
    console.log('🗑️  Deleting old user document...');
    try {
      await deleteDoc(doc(db, 'users', OLD_USER_ID));
      console.log('✅ Old user document deleted');
    } catch (error) {
      console.log('⚠️  Old user document not found or already deleted');
    }

    console.log('\n🎉 User cleanup completed successfully!');
    console.log('📋 Summary:');
    console.log(`  Projects updated: ${oldProjects.length}`);
    console.log(`  Documents updated: ${oldDocuments.length}`);
    console.log(`  Document versions updated: ${oldVersions.length}`);
    console.log(`  Suggestions updated: ${oldSuggestions.length}`);
    console.log(`  Old user deleted: ${OLD_USER_ID}`);
    console.log(`  New demo user: ${demoUser.uid}`);
    console.log('\n💡 All data now belongs to your demo user!');

  } catch (error) {
    console.error('❌ Failed to cleanup users:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
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
  console.log('🧹 WordWise User Cleanup Script');
  console.log('================================\n');

  // Check if emulators are running
  console.log('⚠️  Make sure Firebase emulators are running:');
  console.log('   npm run emulators\n');

  await cleanupUsers();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
} 