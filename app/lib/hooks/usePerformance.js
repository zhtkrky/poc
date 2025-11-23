'use client';

import { dashboardApi } from '../api/client';
import { useQuery } from './useQuery';

/**
 * Custom hook for fetching performance data
 */
export function usePerformance(options = {}) {
  return useQuery(
    'performance', // Query key
    dashboardApi.getPerformance,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes (performance data changes less frequently)
      cacheTime: 15 * 60 * 1000, // 15 minutes
      ...options,
    }
  );
}
