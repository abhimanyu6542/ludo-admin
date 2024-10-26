import { useQuery } from '@tanstack/react-query';
import { getKycDataApi } from '../api/kycApi';
import { KYC_QUERY_KEY } from '../constants/kycQuerKey';

export const userGetKycQuery = () => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [KYC_QUERY_KEY],
      async () => {
        return await getKycDataApi();
      },
      {
        keepPreviousData: true,
        staleTime: 10000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
