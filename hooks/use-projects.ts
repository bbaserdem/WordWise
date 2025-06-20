/**
 * @fileoverview Custom React hook for managing projects.
 *
 * This hook provides a clean interface for project operations including
 * CRUD operations, state management, and error handling.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  searchProjects,
  updateProjectStats,
  updateProjectLastAccessed,
} from '@/lib/db/projects';
import type {
  Project,
  CreateProjectFormData,
  UpdateProjectFormData,
  ProjectFilters,
  ProjectListResponse,
} from '@/types/project';

/**
 * Hook state interface for project management.
 *
 * @since 1.0.0
 */
interface UseProjectsState {
  /** List of projects */
  projects: Project[];
  /** Currently selected project */
  currentProject: Project | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Pagination information */
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Hook return interface for project management.
 *
 * @since 1.0.0
 */
interface UseProjectsReturn extends UseProjectsState {
  /** Create a new project */
  createProject: (projectData: CreateProjectFormData) => Promise<Project>;
  /** Get projects with filters */
  getProjects: (filters?: ProjectFilters) => Promise<void>;
  /** Get a single project by ID */
  getProject: (projectId: string) => Promise<Project | null>;
  /** Update a project */
  updateProject: (projectId: string, updateData: UpdateProjectFormData) => Promise<Project>;
  /** Delete a project */
  deleteProject: (projectId: string) => Promise<boolean>;
  /** Search projects */
  searchProjects: (searchTerm: string) => Promise<Project[]>;
  /** Update project statistics */
  updateProjectStats: (projectId: string, statsUpdate: Partial<Project['stats']>) => Promise<void>;
  /** Update project last accessed */
  updateProjectLastAccessed: (projectId: string) => Promise<void>;
  /** Set current project */
  setCurrentProject: (project: Project | null) => void;
  /** Clear error */
  clearError: () => void;
  /** Refresh projects list */
  refreshProjects: () => Promise<void>;
}

/**
 * Custom hook for managing projects.
 *
 * This hook provides a complete interface for project management including
 * CRUD operations, state management, and error handling. It integrates
 * with the authentication context to ensure proper user access control.
 *
 * @param initialFilters - Initial filters for loading projects
 * @returns Project management interface
 *
 * @example
 * ```tsx
 * const {
 *   projects,
 *   isLoading,
 *   error,
 *   createProject,
 *   getProjects,
 *   updateProject,
 *   deleteProject
 * } = useProjects();
 *
 * // Create a new project
 * const handleCreateProject = async () => {
 *   try {
 *     const newProject = await createProject({
 *       name: 'My Research Paper',
 *       description: 'A research paper about AI',
 *       type: 'research-paper',
 *       tags: ['ai', 'research'],
 *       visibility: 'private',
 *       enableCollaboration: false,
 *       writingStyle: 'academic',
 *       citationFormat: 'apa'
 *     });
 *     console.log('Project created:', newProject);
 *   } catch (error) {
 *     console.error('Failed to create project:', error);
 *   }
 * };
 * ```
 *
 * @since 1.0.0
 */
export function useProjects(initialFilters?: ProjectFilters): UseProjectsReturn {
  const { user } = useAuth();
  const [state, setState] = useState<UseProjectsState>({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasMore: false,
    },
  });

  /**
   * Set loading state.
   *
   * @param loading - Whether to set loading state
   */
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null }));
  }, []);

  /**
   * Set error state.
   *
   * @param error - Error message
   */
  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  /**
   * Clear error state.
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Create a new project.
   *
   * @param projectData - Project creation data
   * @returns The created project
   */
  const handleCreateProject = useCallback(async (projectData: CreateProjectFormData): Promise<Project> => {
    if (!user) {
      throw new Error('User must be authenticated to create projects');
    }

    setLoading(true);
    try {
      const newProject = await createProject(user.uid, projectData);
      setState(prev => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        isLoading: false,
      }));
      return newProject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      setError(errorMessage);
      throw error;
    }
  }, [user, setLoading, setError]);

  /**
   * Get projects with optional filters.
   *
   * @param filters - Optional filters for the query
   */
  const handleGetProjects = useCallback(async (filters?: ProjectFilters): Promise<void> => {
    if (!user) {
      setError('User must be authenticated to load projects');
      return;
    }

    setLoading(true);
    try {
      const response = await getProjects(user.uid, filters);
      setState(prev => ({
        ...prev,
        projects: response.projects,
        pagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
          hasMore: response.hasMore,
        },
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      setError(errorMessage);
    }
  }, [user, setLoading, setError]);

  /**
   * Get a single project by ID.
   *
   * @param projectId - ID of the project to retrieve
   * @returns The project or null if not found
   */
  const handleGetProject = useCallback(async (projectId: string): Promise<Project | null> => {
    if (!user) {
      setError('User must be authenticated to load projects');
      return null;
    }

    setLoading(true);
    try {
      const project = await getProject(projectId, user.uid);
      setState(prev => ({
        ...prev,
        currentProject: project,
        isLoading: false,
      }));
      return project;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load project';
      setError(errorMessage);
      return null;
    }
  }, [user, setLoading, setError]);

  /**
   * Update a project.
   *
   * @param projectId - ID of the project to update
   * @param updateData - Project update data
   * @returns The updated project
   */
  const handleUpdateProject = useCallback(async (
    projectId: string,
    updateData: UpdateProjectFormData
  ): Promise<Project> => {
    if (!user) {
      throw new Error('User must be authenticated to update projects');
    }

    setLoading(true);
    try {
      const updatedProject = await updateProject(projectId, user.uid, updateData);
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === projectId ? updatedProject : p),
        currentProject: prev.currentProject?.id === projectId ? updatedProject : prev.currentProject,
        isLoading: false,
      }));
      return updatedProject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      setError(errorMessage);
      throw error;
    }
  }, [user, setLoading, setError]);

  /**
   * Delete a project.
   *
   * @param projectId - ID of the project to delete
   * @returns True if project was successfully deleted
   */
  const handleDeleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User must be authenticated to delete projects');
    }

    setLoading(true);
    try {
      const success = await deleteProject(projectId, user.uid);
      if (success) {
        setState(prev => ({
          ...prev,
          projects: prev.projects.filter(p => p.id !== projectId),
          currentProject: prev.currentProject?.id === projectId ? null : prev.currentProject,
          isLoading: false,
        }));
      }
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      setError(errorMessage);
      throw error;
    }
  }, [user, setLoading, setError]);

  /**
   * Search projects.
   *
   * @param searchTerm - Search term to look for
   * @returns List of matching projects
   */
  const handleSearchProjects = useCallback(async (searchTerm: string): Promise<Project[]> => {
    if (!user) {
      setError('User must be authenticated to search projects');
      return [];
    }

    setLoading(true);
    try {
      const results = await searchProjects(user.uid, searchTerm);
      setLoading(false);
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search projects';
      setError(errorMessage);
      return [];
    }
  }, [user, setLoading, setError]);

  /**
   * Update project statistics.
   *
   * @param projectId - ID of the project to update
   * @param statsUpdate - Partial statistics update
   */
  const handleUpdateProjectStats = useCallback(async (
    projectId: string,
    statsUpdate: Partial<Project['stats']>
  ): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to update project statistics');
    }

    try {
      await updateProjectStats(projectId, user.uid, statsUpdate);
      // Update local state with new stats
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => 
          p.id === projectId 
            ? { ...p, stats: { ...p.stats, ...statsUpdate } }
            : p
        ),
        currentProject: prev.currentProject?.id === projectId
          ? { ...prev.currentProject, stats: { ...prev.currentProject.stats, ...statsUpdate } }
          : prev.currentProject,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project statistics';
      setError(errorMessage);
      throw error;
    }
  }, [user, setError]);

  /**
   * Update project last accessed timestamp.
   *
   * @param projectId - ID of the project to update
   */
  const handleUpdateProjectLastAccessed = useCallback(async (projectId: string): Promise<void> => {
    if (!user) {
      return; // Don't throw error for this operation as it's not critical
    }

    try {
      await updateProjectLastAccessed(projectId, user.uid);
      const now = new Date();
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => 
          p.id === projectId 
            ? { ...p, lastAccessedAt: now }
            : p
        ),
        currentProject: prev.currentProject?.id === projectId
          ? { ...prev.currentProject, lastAccessedAt: now }
          : prev.currentProject,
      }));
    } catch (error) {
      // Don't show error for this operation as it's not critical
      console.warn('Failed to update project last accessed:', error);
    }
  }, [user]);

  /**
   * Set current project.
   *
   * @param project - Project to set as current
   */
  const setCurrentProject = useCallback((project: Project | null) => {
    setState(prev => ({ ...prev, currentProject: project }));
  }, []);

  /**
   * Refresh projects list.
   */
  const refreshProjects = useCallback(async (): Promise<void> => {
    await handleGetProjects();
  }, [handleGetProjects]);

  // Load projects on mount if user is authenticated
  useEffect(() => {
    if (user) {
      handleGetProjects(initialFilters);
    }
  }, [user, handleGetProjects, initialFilters]);

  return {
    ...state,
    createProject: handleCreateProject,
    getProjects: handleGetProjects,
    getProject: handleGetProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    searchProjects: handleSearchProjects,
    updateProjectStats: handleUpdateProjectStats,
    updateProjectLastAccessed: handleUpdateProjectLastAccessed,
    setCurrentProject,
    clearError,
    refreshProjects,
  };
} 