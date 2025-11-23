'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { queryCache } from './queryCache';

// Track pending requests to prevent duplicates
const pendingRequests = new Map();

/**
 * useQuery Hook
 * Professional data fetching hook with advanced caching, retry logic, and refetch strategies
 * 
 * @param {string|Array} queryKey - Unique identifier for the query (can be string or array)
 * @param {Function} fetchFn - Function that returns a promise
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, refetch, mutate }
 */
export function useQuery(queryKey, fetchFn, options = {}) {
  const {
    staleTime = 0, // Time before data is considered stale (0 = always stale)
    cacheTime = 5 * 60 * 1000, // Time before cached data is garbage collected
    refetchOnWindowFocus = true, // Refetch when window regains focus
    refetchInterval = null, // Polling interval in ms
    retry = 3, // Number of retry attempts
    retryDelay = 1000, // Delay between retries in ms
    enabled = true, // Whether to execute the query
    onSuccess = null, // Success callback
    onError = null, // Error callback
  } = options;

  // Convert queryKey to string for cache lookup
  const cacheKey = Array.isArray(queryKey) ? queryKey.join('-') : queryKey.toString();

  // Initialize state from cache if available
  const [data, setData] = useState(() => {
    const entry = queryCache.get(cacheKey);
    return entry?.data ?? null;
  });

  const [loading, setLoading] = useState(() => {
    const entry = queryCache.get(cacheKey);
    return !entry?.data;
  });

  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  /**
   * Check if cached data is stale
   */
  const isStale = useCallback(() => {
    const entry = queryCache.get(cacheKey);
    if (!entry) return true;
    return Date.now() - entry.timestamp > staleTime;
  }, [cacheKey, staleTime]);

  /**
   * Sleep utility for retry delays
   */
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Execute fetch with retry logic and request deduplication
   */
  const executeFetch = useCallback(async (showLoading = true) => {
    // Return cached data if not stale
    if (!isStale()) {
      const entry = queryCache.get(cacheKey);
      if (entry?.data) {
        setData(entry.data);
        setLoading(false);
        return entry.data;
      }
    }

    // Check if there's already a pending request for this query
    if (pendingRequests.has(cacheKey)) {
      // Wait for the existing request to complete
      try {
        const result = await pendingRequests.get(cacheKey);
        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        setError(err.message || 'An error occurred');
        setLoading(false);
        throw err;
      }
    }

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    let attempt = 0;

    // Create a new promise for this request
    const requestPromise = (async () => {
      while (attempt <= retry) {
        try {
          const result = await fetchFn();
          
          // Only update state if component is still mounted
          if (!isMountedRef.current) return result?.success ? result.data : result;

          const responseData = result?.success ? result.data : result;

          // Store in cache with automatic cleanup
          queryCache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now(),
            timeoutId: setTimeout(() => {
              queryCache.delete(cacheKey);
            }, cacheTime),
          });

          setData(responseData);
          setLoading(false);

          if (onSuccess) {
            onSuccess(responseData);
          }

          return responseData;
        } catch (err) {
          if (attempt >= retry) {
            const errorMessage = err.message || 'An error occurred';
            
            if (isMountedRef.current) {
              setError(errorMessage);
              setLoading(false);
            }

            if (onError) {
              onError(err);
            }

            throw err;
          }
          
          // Wait before retrying
          await sleep(retryDelay * (attempt + 1));
          attempt++;
        }
      }
    })();

    // Store the pending request
    pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up the pending request
      pendingRequests.delete(cacheKey);
    }
  }, [cacheKey, fetchFn, isStale, retry, retryDelay, cacheTime, onSuccess, onError]);

  /**
   * Refetch function - invalidates cache and refetches
   */
  const refetch = useCallback(() => {
    queryCache.delete(cacheKey);
    return executeFetch();
  }, [cacheKey, executeFetch]);

  /**
   * Mutate function for optimistic updates
   */
  const mutate = useCallback((newData) => {
    setData(newData);
    queryCache.set(cacheKey, {
      data: newData,
      timestamp: Date.now(),
      timeoutId: setTimeout(() => {
        queryCache.delete(cacheKey);
      }, cacheTime),
    });
  }, [cacheKey, cacheTime]);

  /**
   * Initial fetch
   */
  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      executeFetch();
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, executeFetch]);

  /**
   * Refetch on window focus
   */
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      if (isStale()) {
        executeFetch(false); // Silent refetch
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, enabled, executeFetch, isStale]);

  /**
   * Polling interval
   */
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    intervalRef.current = setInterval(() => {
      executeFetch(false); // Silent refetch
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, executeFetch]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
    isStale: isStale(),
  };
}

