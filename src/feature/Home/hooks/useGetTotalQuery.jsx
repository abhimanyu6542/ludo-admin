import { useQuery } from '@tanstack/react-query';
import {
  GET_TOTAL_WITHDRAWAL_QUERY_KEY,
  GET_TOTAL_RECHARGE_QUERY_KEY,
  GET_TOTAL_COMMISSION_QUERY_KEY,
  GET_TOTAL_GAME_QUERY_KEY,
} from '../constants/homeQueryKey';
import {
  getTotalCommissionData,
  getTotalRechargeData,
  getTotalwithdrawnData,
  getTotalBattleData,
} from '../api/homeApi';

export const useGetTotalWithdrawalQuery = (filters) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [
        {
          scope: GET_TOTAL_WITHDRAWAL_QUERY_KEY,
          filters,
        },
      ],
      async () => {
        return await getTotalwithdrawnData(filters.startDate, filters.endDate);
      },
      {
        keepPreviousData: true,
        staleTime: 5000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};

export const useGetTotalRechargeQuery = (filters) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [
        {
          scope: GET_TOTAL_RECHARGE_QUERY_KEY,
          filters,
        },
      ],
      async () => {
        return await getTotalRechargeData(filters.startDate, filters.endDate);
      },
      {
        keepPreviousData: true,
        staleTime: 5000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};

export const useGetTotalCommissionQuery = (filters) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [
        {
          scope: GET_TOTAL_COMMISSION_QUERY_KEY,
          filters,
        },
      ],
      async () => {
        return await getTotalCommissionData(filters.startDate, filters.endDate);
      },
      {
        keepPreviousData: true,
        staleTime: 5000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};

export const useGetTotalBattleQuery = (filters) => {
  const { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching } =
    useQuery(
      [
        {
          scope: GET_TOTAL_GAME_QUERY_KEY,
          filters,
        },
      ],
      async () => {
        return await getTotalBattleData(filters.startDate, filters.endDate);
      },
      {
        keepPreviousData: true,
        staleTime: 5000,
      }
    );
  return { isLoading, data, isError, error, isPreviousData, isFetching, refetch, isRefetching };
};
