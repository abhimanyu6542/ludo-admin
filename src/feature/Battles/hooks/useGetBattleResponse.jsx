import { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabaseClient';
import { BATTLE_STATUS, DB_TABLE_NAME } from '../../../constants/common';
import { useDispatch } from 'react-redux';
import {
  setCancelBattleResponse,
  setCancelBattleResponseIds,
  addCancelBattleResponseIds,
  addCancelBattleResponse,
  setAllBattleResponse,
  addAllBattleResponse,
} from '../../../slice/battle.slice';

export const useGetBattleResponse = () => {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const processData = (data) => {

    const uniqueBattleIds = new Set(data.map((item) => item.battle_id));

    // Convert the Set back to an array if needed
    const uniqueBattleIdsArray = [...uniqueBattleIds];
    dispatch(setCancelBattleResponseIds(uniqueBattleIdsArray));
    dispatch(setAllBattleResponse(data));
    dispatch(setCancelBattleResponse(data.filter((battle) => battle.match_response === BATTLE_STATUS.CANCELLED)))
  };
  const processRealTimeData = (data) => {
    console.log(data.new, 'real-time data'); // Avoid using 'new' if it's a reserved word
    const newData = data.new;
    dispatch(addAllBattleResponse(newData));
    if (newData.match_response === BATTLE_STATUS.CANCELLED) {
      dispatch(
        addCancelBattleResponse(
          newData // Update with the correct property name
        )
      );
      dispatch(addCancelBattleResponseIds(newData));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const { data, error } = await supabase
          .from(DB_TABLE_NAME.BATTLE_USER_RESPONSE)
          .select(`*`);

        if (error) throw error;
        processData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();

    const subscription = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: DB_TABLE_NAME.BATTLE_USER_RESPONSE,
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

  return { isDataLoading, error };
};
