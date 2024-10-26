import { useQuery } from '@tanstack/react-query';
import { fetchUserDataApi } from '../api/userApi';
import { GET_USERS_QUERY_KEY } from '../constants/userQueryKey';

const useGetUsersQuery = (filters) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      // [GET_USERS_QUERY_KEY],
      [{
        scope: GET_USERS_QUERY_KEY,
        filters,
      }],
      async () => {
        return await fetchUserDataApi(filters.search);
      },
      {
        keepPreviousData: true,
        staleTime: 5000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
export default useGetUsersQuery;
