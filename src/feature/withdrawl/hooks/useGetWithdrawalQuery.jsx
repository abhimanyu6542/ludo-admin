import { useQuery } from '@tanstack/react-query';
import { fetchWithdrawalData } from '../api/withdrawalApi';
import { FETCH_WITHDRAWAL_DATA } from '../constants/queryKeys';

export const useGetWithdrawalQuery = () => {
    const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
        useQuery(
            [FETCH_WITHDRAWAL_DATA],
            async () => {
                return await fetchWithdrawalData();
            },
            {
                keepPreviousData: true,
                staleTime: 10000,
            }
        );
    return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
