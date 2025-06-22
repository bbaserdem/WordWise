/**
 * @fileoverview Script to fix project stats for existing projects.
 *
 * This script updates existing projects in the database to ensure they have
 * the proper stats property initialized. This fixes projects that were created
 * before the stats property was added to the type definition.
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
import { getFirestore, collection, getDocs, updateDoc, doc, connectFirestoreEmulator, Timestamp, query, where } from 'firebase/firestore';

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
 * Default project stats structure.
 *
 * @since 1.0.0
 */
const DEFAULT_PROJECT_STATS = {
  documentCount: 0,
  totalWordCount: 0,
  totalCharacterCount: 0,
  suggestionsApplied: 0,
  suggestionsIgnored: 0,
  timeSpentWriting: 0,
  lastSessionDuration: 0,
  collaboratorCount: 0,
  versionCount: 0,
};

/**
 * Fix project stats for existing projects.
 *
 * This function updates all projects in the database to ensure they have
 * the proper stats property initialized and accurate document counts.
 *
 * @since 1.0.0
 */
async function fixProjectStats() {
  try {
    console.log('🔧 Starting project stats fix...');

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

    // Get all projects for the user
    console.log('📁 Fetching projects...');
    const projectsRef = collection(db, 'projects');
    const projectsQuery = query(projectsRef, where('userId', '==', user.uid));
    const projectsSnapshot = await getDocs(projectsQuery);
    
    const projects = projectsSnapshot.docs;
    console.log(`📊 Found ${projects.length} projects for user`);

    let fixedCount = 0;
    let skippedCount = 0;

    // Check and fix each project
    for (const projectDoc of projects) {
      const projectData = projectDoc.data();
      const projectId = projectDoc.id;

      console.log(`🔍 Checking project: ${projectData.name} (${projectId})`);

      // Get actual document count for this project
      const documentsRef = collection(db, 'documents');
      const documentsQuery = query(
        documentsRef, 
        where('projectId', '==', projectId),
        where('userId', '==', user.uid),
        where('status', '!=', 'archived')
      );
      const documentsSnapshot = await getDocs(documentsQuery);
      const actualDocumentCount = documentsSnapshot.size;

      console.log(`  📄 Found ${actualDocumentCount} active documents`);

      // Check if stats property exists and is properly structured
      if (!projectData.stats || typeof projectData.stats !== 'object') {
        console.log(`  ❌ Missing or invalid stats property, fixing...`);
        
        // Update the project with proper stats including actual document count
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
          stats: {
            ...DEFAULT_PROJECT_STATS,
            documentCount: actualDocumentCount,
          },
          updatedAt: Timestamp.now(),
        });
        
        console.log(`  ✅ Fixed stats for project: ${projectData.name} (${actualDocumentCount} documents)`);
        fixedCount++;
      } else if (projectData.stats.documentCount !== actualDocumentCount) {
        console.log(`  ⚠️  Document count mismatch (stored: ${projectData.stats.documentCount}, actual: ${actualDocumentCount}), fixing...`);
        
        // Update just the document count
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
          'stats.documentCount': actualDocumentCount,
          updatedAt: Timestamp.now(),
        });
        
        console.log(`  ✅ Fixed document count for project: ${projectData.name}`);
        fixedCount++;
      } else {
        console.log(`  ✅ Project already has correct stats (${actualDocumentCount} documents)`);
        skippedCount++;
      }
    }

    console.log('🎉 Project stats fix completed!');
    console.log(`📊 Summary:`);
    console.log(`  Projects checked: ${projects.length}`);
    console.log(`  Projects fixed: ${fixedCount}`);
    console.log(`  Projects skipped: ${skippedCount}`);

  } catch (error) {
    console.error('❌ Project stats fix failed:', error);
    throw error;
  }
}

/**
 * Main function to run the fix script.
 *
 * @since 1.0.0
 */
async function main() {
  console.log('🔧 WordWise Project Stats Fix Script');
  console.log('=====================================');

  // Run the fix
  await fixProjectStats();
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { fixProjectStats }; 