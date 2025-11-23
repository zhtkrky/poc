'use client';

import { dashboardApi } from '../api/client';
import { useQuery } from './useQuery';

/**
 * Custom hook for fetching stats data
 */
export function useStats(options = {}) {
  return useQuery(
    'stats', // Query key
    dashboardApi.getStats,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );
}
