'use client';

import { dashboardApi } from '../api/client';
import { useQuery } from './useQuery';

/**
 * Custom hook for fetching projects data
 */
export function useProjects(options = {}) {
  return useQuery(
    'projects', // Query key
    dashboardApi.getProjects,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );
}

/**
 * Custom hook for fetching a single project by ID
 * @param {number|string} id - Project ID
 */
export function useProject(id, options = {}) {
  return useQuery(
    ['project', id], // Query key with ID
    () => dashboardApi.getProject(id),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      enabled: !!id, // Only fetch if ID is provided
      ...options,
    }
  );
}
