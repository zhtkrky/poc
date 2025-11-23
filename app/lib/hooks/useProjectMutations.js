'use client';

import { dashboardApi } from '../api/client';
import { queryCache } from './queryCache';
import { useMutation } from './useMutation';

/**
 * Custom hook for creating a project
 * Automatically invalidates projects cache on success
 */
export function useCreateProject(options = {}) {
  return useMutation(
    (projectData) => dashboardApi.createProject(projectData),
    {
      onSuccess: (data) => {
        // Invalidate projects cache to trigger refetch
        queryCache.delete('projects');
        
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: options.onError,
    }
  );
}

/**
 * Custom hook for updating a project
 * Automatically invalidates projects cache on success
 */
export function useUpdateProject(options = {}) {
  return useMutation(
    ({ id, data }) => dashboardApi.updateProject(id, data),
    {
      onSuccess: (data) => {
        // Invalidate both projects list and individual project cache
        queryCache.delete('projects');
        queryCache.delete(`project-${data.id}`);
        
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: options.onError,
    }
  );
}

/**
 * Custom hook for deleting a project
 * Automatically invalidates projects cache on success
 */
export function useDeleteProject(options = {}) {
  return useMutation(
    (id) => dashboardApi.deleteProject(id),
    {
      onSuccess: (data) => {
        // Invalidate projects cache to trigger refetch
        queryCache.delete('projects');
        
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: options.onError,
    }
  );
}
