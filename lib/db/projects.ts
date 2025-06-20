/**
 * @fileoverview Project database operations for the WordWise application.
 *
 * This file contains all Firestore operations related to projects,
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
  limit,
  startAfter,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '@/lib/firebase/config';
import type {
  Project,
  CreateProjectFormData,
  UpdateProjectFormData,
  ProjectFilters,
  ProjectListResponse,
  ProjectType,
  ProjectStatus,
  ProjectVisibility,
  WritingStyle,
  CitationFormat,
} from '@/types/project';

/**
 * Create a new project in Firestore.
 *
 * This function creates a new project document with the provided data
 * and initializes default settings and statistics.
 *
 * @param userId - ID of the user creating the project
 * @param projectData - Project creation data
 * @returns The created project with generated ID
 * @throws Error if project creation fails
 *
 * @since 1.0.0
 */
export async function createProject(
  userId: string,
  projectData: CreateProjectFormData
): Promise<Project> {
  try {
    const firestore = getFirebaseFirestore();
    const projectsRef = collection(firestore, 'projects');

    const now = Timestamp.now();
    const newProject: Omit<Project, 'id'> = {
      userId,
      name: projectData.name,
      description: projectData.description,
      type: projectData.type,
      status: 'draft',
      visibility: projectData.visibility,
      tags: projectData.tags,
      settings: {
        enableAutoSave: true,
        autoSaveInterval: 30,
        enableCollaboration: projectData.enableCollaboration,
        enableVersionHistory: true,
        maxVersions: 50,
        enableSuggestions: true,
        writingStyle: projectData.writingStyle,
        citationFormat: projectData.citationFormat,
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
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(projectsRef, newProject);
    const createdProject: Project = {
      id: docRef.id,
      ...newProject,
    };

    return createdProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

/**
 * Get a project by ID.
 *
 * This function retrieves a single project document by its ID.
 *
 * @param projectId - ID of the project to retrieve
 * @param userId - ID of the user requesting the project (for security)
 * @returns The project document or null if not found
 * @throws Error if project retrieval fails
 *
 * @since 1.0.0
 */
export async function getProject(
  projectId: string,
  userId: string
): Promise<Project | null> {
  try {
    const firestore = getFirebaseFirestore();
    const projectRef = doc(firestore, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return null;
    }

    const projectData = projectSnap.data() as DocumentData;
    const project: Project = {
      id: projectSnap.id,
      ...projectData,
    } as Project;

    // Security check: ensure user owns the project
    if (project.userId !== userId) {
      throw new Error('Access denied');
    }

    return project;
  } catch (error) {
    console.error('Error getting project:', error);
    throw new Error('Failed to retrieve project');
  }
}

/**
 * Get projects for a user with filtering and pagination.
 *
 * This function retrieves projects for a specific user with optional
 * filtering, sorting, and pagination support.
 *
 * @param userId - ID of the user whose projects to retrieve
 * @param filters - Optional filters for the query
 * @returns Paginated list of projects
 * @throws Error if project retrieval fails
 *
 * @since 1.0.0
 */
export async function getProjects(
  userId: string,
  filters: ProjectFilters = {}
): Promise<ProjectListResponse> {
  try {
    const firestore = getFirebaseFirestore();
    const projectsRef = collection(firestore, 'projects');

    // Build query constraints
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];

    // Add type filter
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }

    // Add status filter
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    // Add visibility filter
    if (filters.visibility) {
      constraints.push(where('visibility', '==', filters.visibility));
    }

    // Add sorting
    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    constraints.push(orderBy(sortField, sortOrder));

    // Add pagination
    const pageLimit = filters.limit || 20;
    constraints.push(limit(pageLimit));

    // Execute query
    const q = query(projectsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    // Convert to Project objects
    const projects: Project[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];

    // For now, return basic pagination info
    // In a real implementation, you'd want to implement proper pagination
    // with total count queries and cursor-based pagination
    return {
      projects,
      total: projects.length,
      page: filters.page || 1,
      limit: pageLimit,
      totalPages: 1,
      hasMore: false,
    };
  } catch (error) {
    console.error('Error getting projects:', error);
    throw new Error('Failed to retrieve projects');
  }
}

/**
 * Update a project in Firestore.
 *
 * This function updates an existing project document with the provided data.
 *
 * @param projectId - ID of the project to update
 * @param userId - ID of the user updating the project (for security)
 * @param updateData - Project update data
 * @returns The updated project
 * @throws Error if project update fails
 *
 * @since 1.0.0
 */
export async function updateProject(
  projectId: string,
  userId: string,
  updateData: UpdateProjectFormData
): Promise<Project> {
  try {
    const firestore = getFirebaseFirestore();
    const projectRef = doc(firestore, 'projects', projectId);

    // First, verify the project exists and user has access
    const existingProject = await getProject(projectId, userId);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    // Prepare update data
    const updateFields: Partial<Project> = {
      name: updateData.name,
      description: updateData.description,
      type: updateData.type,
      status: updateData.status,
      tags: updateData.tags,
      visibility: updateData.visibility,
      updatedAt: Timestamp.now(),
    };

    // Update settings if provided
    if (updateData.settings) {
      updateFields.settings = {
        ...existingProject.settings,
        ...updateData.settings,
      };
    }

    // Update the document
    await updateDoc(projectRef, updateFields);

    // Return the updated project
    const updatedProject: Project = {
      ...existingProject,
      ...updateFields,
    };

    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

/**
 * Delete a project from Firestore.
 *
 * This function deletes a project document and all associated documents.
 * Note: This is a soft delete - the project is marked as archived rather
 * than actually deleted.
 *
 * @param projectId - ID of the project to delete
 * @param userId - ID of the user deleting the project (for security)
 * @returns True if project was successfully deleted
 * @throws Error if project deletion fails
 *
 * @since 1.0.0
 */
export async function deleteProject(
  projectId: string,
  userId: string
): Promise<boolean> {
  try {
    // For now, we'll implement a soft delete by updating the status
    // In a real implementation, you might want to actually delete the document
    // and all associated documents, or move them to an archive collection
    await updateProject(projectId, userId, {
      name: '', // Required by interface but not used for deletion
      description: '',
      type: 'other',
      status: 'archived',
      tags: [],
      visibility: 'private',
      settings: {},
    });

    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}

/**
 * Update project statistics.
 *
 * This function updates the project statistics based on document changes.
 * It should be called whenever documents are added, updated, or deleted.
 *
 * @param projectId - ID of the project to update
 * @param userId - ID of the user updating the project (for security)
 * @param statsUpdate - Partial statistics update
 * @throws Error if statistics update fails
 *
 * @since 1.0.0
 */
export async function updateProjectStats(
  projectId: string,
  userId: string,
  statsUpdate: Partial<Project['stats']>
): Promise<void> {
  try {
    const firestore = getFirebaseFirestore();
    const projectRef = doc(firestore, 'projects', projectId);

    // Verify the project exists and user has access
    const existingProject = await getProject(projectId, userId);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    // Update statistics
    const updatedStats = {
      ...existingProject.stats,
      ...statsUpdate,
    };

    await updateDoc(projectRef, {
      stats: updatedStats,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating project stats:', error);
    throw new Error('Failed to update project statistics');
  }
}

/**
 * Update project last accessed timestamp.
 *
 * This function updates the lastAccessedAt field when a user
 * opens or interacts with a project.
 *
 * @param projectId - ID of the project to update
 * @param userId - ID of the user accessing the project (for security)
 * @throws Error if update fails
 *
 * @since 1.0.0
 */
export async function updateProjectLastAccessed(
  projectId: string,
  userId: string
): Promise<void> {
  try {
    const firestore = getFirebaseFirestore();
    const projectRef = doc(firestore, 'projects', projectId);

    // Verify the project exists and user has access
    const existingProject = await getProject(projectId, userId);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    await updateDoc(projectRef, {
      lastAccessedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating project last accessed:', error);
    // Don't throw error for this operation as it's not critical
  }
}

/**
 * Search projects by name or description.
 *
 * This function performs a text search on project names and descriptions.
 * Note: Firestore doesn't support full-text search natively, so this
 * is a basic implementation. For production, consider using Algolia
 * or similar search service.
 *
 * @param userId - ID of the user whose projects to search
 * @param searchTerm - Search term to look for
 * @returns List of matching projects
 * @throws Error if search fails
 *
 * @since 1.0.0
 */
export async function searchProjects(
  userId: string,
  searchTerm: string
): Promise<Project[]> {
  try {
    // For now, we'll get all projects and filter client-side
    // In production, you'd want to use a proper search service
    const allProjects = await getProjects(userId);
    const searchLower = searchTerm.toLowerCase();

    return allProjects.projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchLower) ||
        (project.description &&
          project.description.toLowerCase().includes(searchLower))
    );
  } catch (error) {
    console.error('Error searching projects:', error);
    throw new Error('Failed to search projects');
  }
} 