'use client';

import { dashboardApi } from '../api/client';
import { useQuery } from './useQuery';

/**
 * Custom hook for fetching tasks data
 */
export function useTasks(options = {}) {
  return useQuery(
    'tasks', // Query key
    dashboardApi.getTasks,
    {
      staleTime: 10 * 1000, // 10 seconds (for testing - change back to 2 * 60 * 1000 for production)
      cacheTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );
}
