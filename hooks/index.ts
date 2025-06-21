/**
 * @fileoverview Index file for custom React hooks.
 * 
 * This file exports all custom hooks used throughout the application.
 * Each hook should be properly documented and follow the established
 * patterns for React hooks.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

export { useAuth } from '@/lib/auth/auth-context';

// Export custom hooks here as they are created
export { useFirestoreConnection } from './use-firestore-connection';
export { useDocument } from './use-documents';
// Example: export { useProjects } from './use-projects'; 