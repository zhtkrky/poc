'use client';

import { useCallback, useState } from 'react';

/**
 * useMutation Hook
 * Custom hook for handling CREATE, UPDATE, DELETE operations
 * 
 * @param {Function} mutationFn - Function that performs the mutation
 * @param {Object} options - Configuration options
 * @returns {Object} - { mutate, loading, error, data, reset }
 */
export function useMutation(mutationFn, options = {}) {
  const {
    onSuccess = null,
    onError = null,
    onSettled = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute the mutation
   */
  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(...args);
      const responseData = result?.success ? result.data : result;

      setData(responseData);
      setLoading(false);

      if (onSuccess) {
        onSuccess(responseData);
      }

      if (onSettled) {
        onSettled(responseData, null);
      }

      return responseData;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      
      setError(errorMessage);
      setLoading(false);

      if (onError) {
        onError(err);
      }

      if (onSettled) {
        onSettled(null, err);
      }

      throw err;
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  /**
   * Reset mutation state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    data,
    loading,
    error,
    reset,
  };
}
