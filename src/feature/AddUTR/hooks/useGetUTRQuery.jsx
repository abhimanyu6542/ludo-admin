import { useQuery } from '@tanstack/react-query';
import { getUTRDataApi } from '../api/utrApi';
import { UTR_QUERY_KEY } from '../constants/utrQuerKey';

export const useGetUTRQuery = () => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [UTR_QUERY_KEY],
      async () => {
        return await getUTRDataApi();
      },
      {
        keepPreviousData: true,
        staleTime: 10000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
 