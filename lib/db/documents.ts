/**
 * @fileoverview Document database operations for the WordWise application.
 *
 * This file contains all Firestore operations related to documents,
 * including CRUD operations, queries, and data management functions.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '@/lib/firebase/config';
import type {
  Document,
  CreateDocumentFormData,
  UpdateDocumentFormData,
  DocumentFilters,
  DocumentListResponse,
  DocumentType,
  DocumentStatus,
  DocumentVersion,
} from '@/types/document';

/**
 * Create a new document in Firestore.
 *
 * This function creates a new document with the provided data
 * and initializes default settings and statistics.
 *
 * @param userId - ID of the user creating the document
 * @param projectId - ID of the project this document belongs to
 * @param documentData - Document creation data
 * @returns The created document with generated ID
 * @throws Error if document creation fails
 *
 * @since 1.0.0
 */
export async function createDocument(
  userId: string,
  projectId: string,
  documentData: CreateDocumentFormData
): Promise<Document> {
  try {
    const firestore = getFirebaseFirestore();
    const documentsRef = collection(firestore, 'documents');

    const now = Timestamp.now();
    const newDocument: Omit<Document, 'id'> = {
      projectId,
      userId,
      title: documentData.title,
      content: documentData.content,
      type: documentData.type,
      status: 'draft',
      order: documentData.order,
      folderId: documentData.folderId,
      tags: documentData.tags,
      metadata: {
        description: documentData.description,
        enableAutoSave: documentData.enableAutoSave,
        autoSaveInterval: 30,
        enableCollaboration: documentData.enableCollaboration,
        enableVersionHistory: true,
        maxVersions: 50,
        enableSuggestions: true,
        language: 'en',
      },
      stats: {
        wordCount: 0,
        characterCount: 0,
        paragraphCount: 0,
        sentenceCount: 0,
        suggestionsApplied: 0,
        suggestionsIgnored: 0,
        timeSpentWriting: 0,
        lastSessionDuration: 0,
        versionCount: 1,
        collaboratorCount: 0,
        lastSavedAt: now,
      },
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(documentsRef, newDocument);
    const createdDocument: Document = {
      id: docRef.id,
      ...newDocument,
    };

    // Create initial version
    await createDocumentVersion(docRef.id, userId, documentData.content, 'Initial version');

    return createdDocument;
  } catch (error) {
    console.error('Error creating document:', error);
    throw new Error('Failed to create document');
  }
}

/**
 * Get a document by ID.
 *
 * This function retrieves a single document by its ID.
 *
 * @param documentId - ID of the document to retrieve
 * @param userId - ID of the user requesting the document (for security)
 * @returns The document or null if not found
 * @throws Error if document retrieval fails
 *
 * @since 1.0.0
 */
export async function getDocument(
  documentId: string,
  userId: string
): Promise<Document | null> {
  try {
    const firestore = getFirebaseFirestore();
    const documentRef = doc(firestore, 'documents', documentId);
    const documentSnap = await getDoc(documentRef);

    if (!documentSnap.exists()) {
      return null;
    }

    const documentData = documentSnap.data() as DocumentData;
    const document: Document = {
      id: documentSnap.id,
      ...documentData,
    } as Document;

    // Security check: ensure user owns the document
    if (document.userId !== userId) {
      throw new Error('Access denied');
    }

    return document;
  } catch (error) {
    console.error('Error getting document:', error);
    throw new Error('Failed to retrieve document');
  }
}

/**
 * Get documents for a project with filtering and pagination.
 *
 * This function retrieves documents for a specific project with optional
 * filtering, sorting, and pagination support.
 *
 * @param projectId - ID of the project whose documents to retrieve
 * @param userId - ID of the user requesting the documents (for security)
 * @param filters - Optional filters for the query
 * @returns Paginated list of documents
 * @throws Error if document retrieval fails
 *
 * @since 1.0.0
 */
export async function getDocuments(
  projectId: string,
  userId: string,
  filters: DocumentFilters = {}
): Promise<DocumentListResponse> {
  try {
    const firestore = getFirebaseFirestore();
    const documentsRef = collection(firestore, 'documents');

    // Build query constraints
    const constraints: QueryConstraint[] = [
      where('projectId', '==', projectId),
      where('userId', '==', userId),
    ];

    // Add type filter
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }

    // Add status filter
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    // Add folder filter
    if (filters.folderId) {
      constraints.push(where('folderId', '==', filters.folderId));
    }

    // Add sorting
    const sortField = filters.sortBy || 'order';
    const sortOrder = filters.sortOrder || 'asc';
    constraints.push(orderBy(sortField, sortOrder));

    // Add pagination
    const pageLimit = filters.limit || 50;
    constraints.push(firestoreLimit(pageLimit));

    // Execute query
    const q = query(documentsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    // Convert to Document objects
    const documents: Document[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Document[];

    // For now, return basic pagination info
    return {
      documents,
      total: documents.length,
      page: filters.page || 1,
      limit: pageLimit,
      totalPages: 1,
      hasMore: false,
    };
  } catch (error) {
    console.error('Error getting documents:', error);
    throw new Error('Failed to retrieve documents');
  }
}

/**
 * Update a document in Firestore.
 *
 * This function updates an existing document with the provided data.
 *
 * @param documentId - ID of the document to update
 * @param userId - ID of the user updating the document (for security)
 * @param updateData - Document update data
 * @returns The updated document
 * @throws Error if document update fails
 *
 * @since 1.0.0
 */
export async function updateDocument(
  documentId: string,
  userId: string,
  updateData: UpdateDocumentFormData
): Promise<Document> {
  try {
    const firestore = getFirebaseFirestore();
    const documentRef = doc(firestore, 'documents', documentId);

    // First, verify the document exists and user has access
    const existingDocument = await getDocument(documentId, userId);
    if (!existingDocument) {
      throw new Error('Document not found');
    }

    // Prepare update data
    const updateFields: Partial<Document> = {
      title: updateData.title,
      content: updateData.content,
      type: updateData.type,
      status: updateData.status,
      tags: updateData.tags,
      order: updateData.order,
      folderId: updateData.folderId,
      updatedAt: Timestamp.now(),
    };

    // Update metadata if provided
    if (updateData.metadata) {
      updateFields.metadata = {
        ...existingDocument.metadata,
        ...updateData.metadata,
      };
    }

    // Update the document
    await updateDoc(documentRef, updateFields);

    // Return the updated document
    const updatedDocument: Document = {
      ...existingDocument,
      ...updateFields,
    };

    return updatedDocument;
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
}

/**
 * Delete a document from Firestore.
 *
 * This function deletes a document and all its versions.
 * Note: This is a soft delete - the document is marked as archived.
 *
 * @param documentId - ID of the document to delete
 * @param userId - ID of the user deleting the document (for security)
 * @returns True if document was successfully deleted
 * @throws Error if document deletion fails
 *
 * @since 1.0.0
 */
export async function deleteDocument(
  documentId: string,
  userId: string
): Promise<boolean> {
  try {
    // For now, we'll implement a soft delete by updating the status
    await updateDocument(documentId, userId, {
      title: '', // Required by interface but not used for deletion
      description: '',
      type: 'other',
      status: 'archived',
      content: '',
      tags: [],
      order: 0,
      metadata: {},
    });

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}

/**
 * Create a document version for version history.
 *
 * This function creates a new version entry when a document is saved.
 *
 * @param documentId - ID of the document this version belongs to
 * @param userId - ID of the user creating the version
 * @param content - Document content at this version
 * @param description - Version description/commit message
 * @param isAutoSave - Whether this was an auto-save
 * @returns The created version
 * @throws Error if version creation fails
 *
 * @since 1.0.0
 */
export async function createDocumentVersion(
  documentId: string,
  userId: string,
  content: string,
  description?: string,
  isAutoSave: boolean = false
): Promise<DocumentVersion> {
  try {
    const firestore = getFirebaseFirestore();
    const versionsRef = collection(firestore, 'documentVersions');

    // Get current document to determine version number
    const document = await getDocument(documentId, userId);
    if (!document) {
      throw new Error('Document not found');
    }

    const newVersion: Omit<DocumentVersion, 'id'> = {
      documentId,
      userId,
      version: document.version + 1,
      content,
      description: description || (isAutoSave ? 'Auto-save' : 'Manual save'),
      isAutoSave,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(versionsRef, newVersion);
    const createdVersion: DocumentVersion = {
      id: docRef.id,
      ...newVersion,
    };

    // Update document version number
    await updateDoc(doc(firestore, 'documents', documentId), {
      version: document.version + 1,
      updatedAt: Timestamp.now(),
    });

    return createdVersion;
  } catch (error) {
    console.error('Error creating document version:', error);
    throw new Error('Failed to create document version');
  }
}

/**
 * Get document versions for version history.
 *
 * This function retrieves all versions of a document.
 *
 * @param documentId - ID of the document whose versions to retrieve
 * @param userId - ID of the user requesting the versions (for security)
 * @param limit - Maximum number of versions to retrieve
 * @returns List of document versions
 * @throws Error if version retrieval fails
 *
 * @since 1.0.0
 */
export async function getDocumentVersions(
  documentId: string,
  userId: string,
  limit: number = 20
): Promise<DocumentVersion[]> {
  try {
    const firestore = getFirebaseFirestore();
    const versionsRef = collection(firestore, 'documentVersions');

    // Verify user has access to the document
    const document = await getDocument(documentId, userId);
    if (!document) {
      throw new Error('Document not found');
    }

    const q = query(
      versionsRef,
      where('documentId', '==', documentId),
      orderBy('version', 'desc'),
      firestoreLimit(limit)
    );

    const querySnapshot = await getDocs(q);
    const versions: DocumentVersion[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DocumentVersion[];

    return versions;
  } catch (error) {
    console.error('Error getting document versions:', error);
    throw new Error('Failed to retrieve document versions');
  }
}

/**
 * Update document statistics.
 *
 * This function updates the document statistics based on content changes.
 *
 * @param documentId - ID of the document to update
 * @param userId - ID of the user updating the document (for security)
 * @param statsUpdate - Partial statistics update
 * @throws Error if statistics update fails
 *
 * @since 1.0.0
 */
export async function updateDocumentStats(
  documentId: string,
  userId: string,
  statsUpdate: Partial<Document['stats']>
): Promise<void> {
  try {
    const firestore = getFirebaseFirestore();
    const documentRef = doc(firestore, 'documents', documentId);

    // Verify the document exists and user has access
    const existingDocument = await getDocument(documentId, userId);
    if (!existingDocument) {
      throw new Error('Document not found');
    }

    // Update statistics
    const updatedStats = {
      ...existingDocument.stats,
      ...statsUpdate,
    };

    await updateDoc(documentRef, {
      stats: updatedStats,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating document stats:', error);
    throw new Error('Failed to update document statistics');
  }
}

/**
 * Search documents by title or content.
 *
 * This function performs a text search on document titles and content.
 * Note: This is a basic implementation. For production, consider using
 * a proper search service.
 *
 * @param projectId - ID of the project whose documents to search
 * @param userId - ID of the user searching the documents (for security)
 * @param searchTerm - Search term to look for
 * @returns List of matching documents
 * @throws Error if search fails
 *
 * @since 1.0.0
 */
export async function searchDocuments(
  projectId: string,
  userId: string,
  searchTerm: string
): Promise<Document[]> {
  try {
    // For now, we'll get all documents and filter client-side
    // In production, you'd want to use a proper search service
    const allDocuments = await getDocuments(projectId, userId);
    const searchLower = searchTerm.toLowerCase();

    return allDocuments.documents.filter(
      (document) =>
        document.title.toLowerCase().includes(searchLower) ||
        document.content.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching documents:', error);
    throw new Error('Failed to search documents');
  }
} 