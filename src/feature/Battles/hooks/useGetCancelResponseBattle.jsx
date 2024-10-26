import { useQuery } from '@tanstack/react-query';
import { GET_ALL_CANCEL_BATTLE_RESPONSE_QUERY_KEY } from '../../Users/constants/userQueryKey';
import { fetchCancleResponseBattleDataApi } from '../../Users/api/battleApi';

const useGetCancelResponseBattle = (gameId) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } = 
    useQuery(
      [{
        scope: GET_ALL_CANCEL_BATTLE_RESPONSE_QUERY_KEY,
        gameId,
      }],
      async () => {
        return await fetchCancleResponseBattleDataApi(gameId);
      },
      {
        keepPreviousData: true,
        staleTime: 10000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
export default useGetCancelResponseBattle;
