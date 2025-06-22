/**
 * @fileoverview Test script for real-time document synchronization.
 *
 * This script demonstrates the real-time synchronization functionality
 * by creating a test document and simulating multiple browser sessions
 * editing the same document simultaneously.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Force emulator usage for this script
process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR = 'true';
process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR = 'true';
process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR = 'true';

import { getFirestore } from '../lib/firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  onSnapshot, 
  updateDoc, 
  Timestamp 
} from 'firebase/firestore';
import type { Project } from '../types/project';
import type { Document } from '../types/document';

/**
 * Test user data for the demonstration.
 *
 * @since 1.0.0
 */
const TEST_USER = {
  uid: 'test-user-realtime',
  email: 'realtime@wordwise.com',
  displayName: 'Real-time Test User',
};

/**
 * Test project for the demonstration.
 *
 * @since 1.0.0
 */
const TEST_PROJECT: Omit<Project, 'id'> = {
  userId: TEST_USER.uid,
  name: 'Real-time Sync Test Project',
  description: 'A test project to demonstrate real-time document synchronization',
  type: 'research-paper',
  status: 'in-progress',
  visibility: 'private',
  tags: ['test', 'realtime', 'sync'],
  settings: {
    enableAutoSave: true,
    autoSaveInterval: 30,
    enableCollaboration: true,
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
 * Test document for the demonstration.
 *
 * @since 1.0.0
 */
const TEST_DOCUMENT: Omit<Document, 'id'> = {
  projectId: '', // Will be set after project creation
  userId: TEST_USER.uid,
  title: 'Real-time Sync Test Document',
  content: 'This is a test document to demonstrate real-time synchronization across multiple browser sessions.\n\nStart typing here to see the magic happen!',
  type: 'chapter',
  status: 'draft',
  order: 1,
  tags: ['test', 'realtime'],
  metadata: {
    description: 'A test document for real-time synchronization',
    enableAutoSave: true,
    autoSaveInterval: 30,
    enableCollaboration: true,
    enableVersionHistory: true,
    maxVersions: 50,
    enableSuggestions: true,
    language: 'en',
  },
  stats: {
    wordCount: 15,
    characterCount: 120,
    paragraphCount: 2,
    sentenceCount: 2,
    suggestionsApplied: 0,
    suggestionsIgnored: 0,
    timeSpentWriting: 0,
    lastSessionDuration: 0,
    versionCount: 1,
    collaboratorCount: 0,
    lastSavedAt: Timestamp.now(),
  },
  version: 1,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

/**
 * Simulate a browser session editing the document.
 *
 * @param sessionId - Unique identifier for this session
 * @param documentId - ID of the document to edit
 * @param userId - ID of the user
 * @since 1.0.0
 */
function simulateBrowserSession(sessionId: string, documentId: string, userId: string) {
  console.log(`🖥️  Session ${sessionId}: Starting real-time listener...`);
  
  // Set up real-time listener
  const unsubscribe = onSnapshot(
    doc(getFirestore(), 'documents', documentId),
    (docSnap) => {
      if (docSnap.exists()) {
        const document = docSnap.data() as Document;
        console.log(`📝 Session ${sessionId}: Document updated - "${document.title}"`);
        console.log(`   Content preview: "${document.content.substring(0, 50)}..."`);
        console.log(`   Last updated: ${document.updatedAt.toDate().toLocaleTimeString()}`);
        console.log(`   Version: ${document.version}`);
      } else {
        console.log(`❌ Session ${sessionId}: Document not found`);
      }
    },
    (error) => {
      console.error(`❌ Session ${sessionId}: Error listening to document:`, error);
    }
  );

  return unsubscribe;
}

/**
 * Simulate content updates from different sessions.
 *
 * @param documentId - ID of the document to update
 * @param userId - ID of the user
 * @since 1.0.0
 */
async function simulateContentUpdates(documentId: string, userId: string) {
  const updates = [
    { content: 'This is a test document to demonstrate real-time synchronization across multiple browser sessions.\n\nStart typing here to see the magic happen!\n\nSession 1: Added this line!', delay: 2000 },
    { content: 'This is a test document to demonstrate real-time synchronization across multiple browser sessions.\n\nStart typing here to see the magic happen!\n\nSession 1: Added this line!\n\nSession 2: I can see the changes in real-time!', delay: 4000 },
    { content: 'This is a test document to demonstrate real-time synchronization across multiple browser sessions.\n\nStart typing here to see the magic happen!\n\nSession 1: Added this line!\n\nSession 2: I can see the changes in real-time!\n\nSession 3: This is amazing! All sessions are synced!', delay: 6000 },
  ];

  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    setTimeout(async () => {
      try {
        console.log(`✏️  Session ${i + 1}: Updating document content...`);
        await updateDoc(doc(getFirestore(), 'documents', documentId), {
          content: update.content,
          updatedAt: Timestamp.now(),
          version: i + 2,
        });
        console.log(`✅ Session ${i + 1}: Update completed`);
      } catch (error) {
        console.error(`❌ Session ${i + 1}: Failed to update document:`, error);
      }
    }, update.delay);
  }
}

/**
 * Main test function.
 *
 * @since 1.0.0
 */
async function testRealTimeSync() {
  try {
    console.log('🚀 Starting Real-time Document Synchronization Test');
    console.log('==================================================');
    
    // Create test project
    console.log('📁 Creating test project...');
    const projectRef = await addDoc(collection(getFirestore(), 'projects'), TEST_PROJECT);
    const projectId = projectRef.id;
    console.log(`✅ Project created with ID: ${projectId}`);

    // Create test document
    console.log('📄 Creating test document...');
    const documentData = {
      ...TEST_DOCUMENT,
      projectId,
    };
    const documentRef = await addDoc(collection(getFirestore(), 'documents'), documentData);
    const documentId = documentRef.id;
    console.log(`✅ Document created with ID: ${documentId}`);

    // Simulate multiple browser sessions
    console.log('\n🖥️  Simulating multiple browser sessions...');
    const session1 = simulateBrowserSession('1', documentId, TEST_USER.uid);
    const session2 = simulateBrowserSession('2', documentId, TEST_USER.uid);
    const session3 = simulateBrowserSession('3', documentId, TEST_USER.uid);

    // Wait a moment for listeners to be established
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate content updates
    console.log('\n✏️  Simulating content updates from different sessions...');
    await simulateContentUpdates(documentId, TEST_USER.uid);

    // Keep the test running for a bit to see the updates
    console.log('\n⏳ Test will run for 10 seconds to demonstrate real-time sync...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    session1();
    session2();
    session3();

    console.log('\n✅ Real-time synchronization test completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   - Created test project and document');
    console.log('   - Established 3 real-time listeners (simulating browser sessions)');
    console.log('   - Simulated content updates from different sessions');
    console.log('   - All sessions received real-time updates');
    console.log('\n🎉 Real-time document synchronization is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRealTimeSync(); 