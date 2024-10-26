import { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabaseClient';
import { DB_TABLE_NAME } from '../../../constants/common';
import { useDispatch } from 'react-redux';

import {
  setWithdrawalData,
  addWithdrawalData,
  removeFromWithdrawalData,
  addNewWithdrawalData,
} from '../../../slice/withdrawal.slice';

export const useGetAllWithdrawalRequest = () => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const processData = (data) => {
    dispatch(setWithdrawalData(data));
  };
  const processRealTimeData = (data) => {
    console.log(data, 'real time data');

    switch (data.eventType) {
      case 'INSERT':
        if (data.new['type'] == 'withdrawn') {
          dispatch(addWithdrawalData(data.new));
          dispatch(addNewWithdrawalData(data.new));
        }
        break;
      case 'UPDATE':
        if (data.new['type'] == 'withdrawn') {
          dispatch(addWithdrawalData(data.new));
        }
        // if (data.new['type'] == 'withdrawn' && data.new['is_proccessed'] === true) {
        //   dispatch(removeFromWithdrawalData(data.new['id']));
        // }
        break;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from(DB_TABLE_NAME.TRANSACTION_REQUEST)
          .select('id, created_at, amount, utr_no, transfer_preference, status, type, user_id')
          .match({ type: 'withdrawn' });

        if (error) throw error;
        processData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const subscription = supabase
      .channel('transaction_request-all-event-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DB_TABLE_NAME.TRANSACTION_REQUEST,
          select: `id, created_at, amount, utr_no, transfer_preference, status, type, user_id`,
        },
        (payload) => {
          processRealTimeData(payload);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { loading, error };
};
