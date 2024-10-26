import { useQuery } from '@tanstack/react-query';
import { fetchTransactionRequestDataApi } from '../api/transactionRequestApi';
import { GET_TRANSACTION_REQUEST_QUERY_KEY } from '../constants/userQueryKey';

const useGetTransactionRequest = (user_id) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [GET_TRANSACTION_REQUEST_QUERY_KEY],
      async () => {
        return await fetchTransactionRequestDataApi(user_id);
      },
      {
        keepPreviousData: true,
        staleTime: 5000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
export default useGetTransactionRequest;