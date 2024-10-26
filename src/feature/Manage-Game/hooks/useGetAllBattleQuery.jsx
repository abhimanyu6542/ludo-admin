import { useQuery } from '@tanstack/react-query';
import { fetchAllBattleDataApi } from '../../Users/api/battleApi';
import { GET_ALL_BATTLE_QUERY_KEY } from '../../Users/constants/userQueryKey';

const useGetAllBattleQuery = (managedUser) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [GET_ALL_BATTLE_QUERY_KEY],
      async () => {
        return await fetchAllBattleDataApi(managedUser);
      },
      {
        keepPreviousData: true,
        staleTime: 10000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
export default useGetAllBattleQuery;