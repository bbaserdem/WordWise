/**
 * @fileoverview Markdown import script for the WordWise application.
 *
 * This script imports markdown files from the _example directory into the database
 * as test documents. It creates projects and documents with realistic data
 * for development and testing purposes.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Set NODE_ENV first
(process.env as any).NODE_ENV = process.env.NODE_ENV || 'development';

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env files
config({ path: '.env.local' });
config({ path: '.env' });

// Debug: Log environment variables
console.log('🔍 Debug: Environment variables loaded:');
console.log('  NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('  NEXT_PUBLIC_USE_FIRESTORE_EMULATOR:', process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR);
console.log('  NODE_ENV:', process.env.NODE_ENV);

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp, connectFirestoreEmulator } from 'firebase/firestore';
import type { Project } from '../types/project';
import type { Document, CreateDocumentFormData } from '../types/document';

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
 * Test user data for importing documents.
 *
 * @since 1.0.0
 */
const TEST_USER_CREDENTIALS = {
  email: 'test@test.com',
  password: '1234aoeu"<>P',
};

/**
 * Test project data for importing documents.
 *
 * @since 1.0.0
 */
const TEST_PROJECT: Omit<Project, 'id'> = {
  userId: TEST_USER_CREDENTIALS.email,
  name: 'Neural Networks Research Project',
  description: 'A comprehensive research project on neural networks and brain connectivity',
  type: 'research-paper',
  status: 'in-progress',
  visibility: 'private',
  tags: ['neural-networks', 'research', 'academic'],
  settings: {
    enableAutoSave: true,
    autoSaveInterval: 30,
    enableCollaboration: false,
    enableVersionHistory: true,
    maxVersions: 50,
    enableSuggestions: true,
    writingStyle: 'academic',
    citationFormat: 'apa',
    language: 'en',
    enableSpellCheck: true,
    enableGrammarCheck: true,
    enableStyleCheck: true,
  },
  stats: {
    documentCount: 0,
    totalWordCount: 0,
    totalCharacterCount: 0,
    suggestionsApplied: 0,
    suggestionsIgnored: 0,
    timeSpentWriting: 0,
    lastSessionDuration: 0,
    collaboratorCount: 0,
    versionCount: 0,
  },
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

/**
 * Document type mapping for markdown files.
 *
 * @since 1.0.0
 */
const DOCUMENT_TYPE_MAP: Record<string, string> = {
  '0-intro.md': 'introduction',
  '1-connclone.md': 'chapter',
  '2-mapseq.md': 'chapter',
  '3-odor_navigation.md': 'chapter',
  'a1-reinforcement_learning.md': 'appendix',
  'a2-neural_networks.md': 'appendix',
};

/**
 * Document order mapping for proper sequencing.
 *
 * @since 1.0.0
 */
const DOCUMENT_ORDER_MAP: Record<string, number> = {
  '0-intro.md': 1,
  '1-connclone.md': 2,
  '2-mapseq.md': 3,
  '3-odor_navigation.md': 4,
  'a1-reinforcement_learning.md': 5,
  'a2-neural_networks.md': 6,
};

/**
 * Calculate document statistics from content.
 *
 * @param content - Document content
 * @returns Document statistics
 * @since 1.0.0
 */
function calculateDocumentStats(content: string) {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characters = content.length;
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;

  return {
    wordCount: words,
    characterCount: characters,
    paragraphCount: paragraphs,
    sentenceCount: sentences,
    suggestionsApplied: 0,
    suggestionsIgnored: 0,
    timeSpentWriting: 0,
    lastSessionDuration: 0,
    versionCount: 1,
    collaboratorCount: 0,
    lastSavedAt: Timestamp.now(),
  };
}

/**
 * Create a document from markdown content.
 *
 * @param filename - Name of the markdown file
 * @param content - Document content
 * @param projectId - ID of the project this document belongs to
 * @returns Document creation data
 * @since 1.0.0
 */
function createDocumentFromMarkdown(
  filename: string,
  content: string,
  projectId: string
): CreateDocumentFormData {
  const title = filename.replace('.md', '').replace(/[0-9]+-/, '').replace(/_/g, ' ');
  const type = DOCUMENT_TYPE_MAP[filename] || 'other';
  const order = DOCUMENT_ORDER_MAP[filename] || 1;

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: `Imported from ${filename}`,
    type: type as any,
    content: content,
    tags: ['imported', 'markdown', type],
    order: order,
    enableAutoSave: true,
    enableCollaboration: false,
  };
}

/**
 * Import markdown files into the database.
 *
 * @since 1.0.0
 */
async function importMarkdownFiles() {
  try {
    console.log('🚀 Starting markdown import...');

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

    // Create test project with the authenticated user's ID
    console.log('📁 Creating test project...');
    const projectData = {
      ...TEST_PROJECT,
      userId: user.uid, // Use the actual authenticated user ID
    };
    const projectRef = await addDoc(collection(db, 'projects'), projectData);
    const projectId = projectRef.id;
    console.log(`✅ Project created with ID: ${projectId}`);

    // Read markdown files from _example directory
    const exampleDir = join(process.cwd(), '_example');
    const files = readdirSync(exampleDir).filter(file => file.endsWith('.md'));

    console.log(`📄 Found ${files.length} markdown files to import`);

    // Import each markdown file
    for (const filename of files) {
      console.log(`📝 Importing ${filename}...`);

      try {
        // Read file content
        const filePath = join(exampleDir, filename);
        const content = readFileSync(filePath, 'utf-8');

        // Create document data
        const documentData = createDocumentFromMarkdown(filename, content, projectId);

        // Create document in database
        const now = Timestamp.now();
        const newDocument: Omit<Document, 'id'> = {
          projectId,
          userId: user.uid, // Use the actual authenticated user ID
          title: documentData.title,
          content: documentData.content,
          type: documentData.type,
          status: 'draft',
          tags: documentData.tags,
          order: documentData.order,
          metadata: {
            description: documentData.description,
            autoSaveInterval: 30,
            enableVersionHistory: true,
            maxVersions: 50,
            enableSuggestions: true,
            language: 'en',
            enableAutoSave: documentData.enableAutoSave,
            enableCollaboration: documentData.enableCollaboration,
          },
          version: 1,
          stats: calculateDocumentStats(content),
          createdAt: now,
          updatedAt: now,
        };

        const docRef = await addDoc(collection(db, 'documents'), newDocument);
        console.log(`✅ Document created with ID: ${docRef.id}`);

        // Create initial version
        const versionData = {
          documentId: docRef.id,
          userId: user.uid, // Use the actual authenticated user ID
          version: 1,
          content: documentData.content,
          createdAt: now,
          updatedAt: now,
        };

        const versionRef = await addDoc(collection(db, 'documentVersions'), versionData);
        console.log(`✅ Version created with ID: ${versionRef.id}`);

      } catch (error) {
        console.error(`❌ Failed to import ${filename}:`, error);
      }
    }

    console.log('🎉 Markdown import completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`  Project ID: ${projectId}`);
    console.log(`  Files processed: ${files.length}`);
    console.log(`  User ID: ${user.uid}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

/**
 * Main function to run the import script.
 *
 * @since 1.0.0
 */
async function main() {
  console.log('📚 WordWise Markdown Import Script');
  console.log('=====================================');

  // Run the import
  await importMarkdownFiles();
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { importMarkdownFiles }; 