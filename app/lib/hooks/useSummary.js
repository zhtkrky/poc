'use client';

import { dashboardApi } from '../api/client';
import { useQuery } from './useQuery';

/**
 * Custom hook for fetching dashboard summary data
 */
export function useSummary(options = {}) {
  return useQuery(
    'summary', // Query key
    dashboardApi.getSummary,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );
}
