import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../types/api';

interface UseFetchOptions {
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

export const useFetch = <T = any>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const { autoFetch = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || 'An error occurred',
        code: err.code || 'UNKNOWN_ERROR',
        status: err.status || 500,
        details: err.details,
      };
      setError(apiError);
      if (onError) {
        onError(apiError);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  };
};

export default useFetch;