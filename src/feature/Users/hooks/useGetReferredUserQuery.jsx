import { useQuery } from '@tanstack/react-query';
import { GET_REFERRED_USERS_QUERY_KEY } from '../constants/userQueryKey';
import { fetchReferralCodeApi } from '../api/referralCodeApi';

const useGetReferredUserQuery = (unique_code) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [GET_REFERRED_USERS_QUERY_KEY],
      async () => {
        return await fetchReferralCodeApi(unique_code);
      },
      {
        keepPreviousData: true,
        staleTime: 10000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
export default useGetReferredUserQuery;
