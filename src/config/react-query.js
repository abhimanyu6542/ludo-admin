import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default 30 seconds of stale time
      staleTime: 10000,
      // Do not fetch on window focus
      refetchOnWindowFocus: false,
      // Will be retried three times.
      retry: (failureCount, error) => {
        // We want to retry only thrice
        if (failureCount == 3) {
          return false;
        }

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status != undefined && !Number.isNaN(status) && status >= 400 && status < 500) {
            // We would only want to retry server errors
            // Client error responses should not be retried
            return false;
          } else {
            return true;
          }
        }

        return true;
      },
    },
  },
});
