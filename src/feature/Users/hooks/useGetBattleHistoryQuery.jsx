import { useQuery } from '@tanstack/react-query';
import { GET_BATTLE_QUERY_KEY } from '../constants/userQueryKey';
import { fetchBattleDataApi } from '../api/battleApi';

const useGetBattleHistoryQuery = (user_name) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [GET_BATTLE_QUERY_KEY],
      async () => {
        return await fetchBattleDataApi(user_name);
      },
      {
        keepPreviousData: true,
        staleTime: 10000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
export default useGetBattleHistoryQuery;