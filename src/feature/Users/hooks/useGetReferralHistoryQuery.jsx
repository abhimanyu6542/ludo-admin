import { useQuery } from '@tanstack/react-query';
import { GET_REFERRAL_HISTORY_QUERY_KEY } from '../constants/userQueryKey';
import { fetchUserUsingRefCodeDataApi } from '../api/userApi';

const useGetReferralHistoryQuery = (unique_code) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [GET_REFERRAL_HISTORY_QUERY_KEY],
      async () => {
        return await fetchUserUsingRefCodeDataApi(unique_code);
      },
      {
        keepPreviousData: true,
        staleTime: 10000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
export default useGetReferralHistoryQuery;