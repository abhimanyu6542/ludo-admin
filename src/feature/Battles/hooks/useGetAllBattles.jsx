import { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabaseClient';
import { BATTLE_STATUS, DB_TABLE_NAME, TOAST_TYPE } from '../../../constants/common';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDisputedBattles,
  removeDeletedBattles,
  addEndedBattles,
  addNewCreatedBattles,
  addOngoingBattles,
  removeFromDisputedBattles,
  removeFromOngoingBattles,
  setCanceledBattles,
  setDisputedBattles,
  setEndedBattles,
  setNewCreatedBattles,
  setOngoingBattles,
  setIsInsertNewItem,
} from '../../../slice/battle.slice';
import { BattleNotificationSound } from '../../../utils/Search/notifucationSound';
import { ShowToaster } from '../../../components/Toaster/Toaster';

export const useGetAllBattles = () => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const battleState = (state) => state.battle;
  const { isNotificatinOn } = useSelector(battleState);

  const processData = (data) => {
    dispatch(
      setOngoingBattles(data.filter((battle) => battle.battle_status === BATTLE_STATUS.ONGOING))
    );
    dispatch(
      setEndedBattles(data.filter((battle) => battle.battle_status === BATTLE_STATUS.COMPLETED))
    );
    dispatch(
      setDisputedBattles(data.filter((battle) => battle.battle_status === BATTLE_STATUS.DISPUTED))
    );
    dispatch(
      setCanceledBattles(data.filter((battle) => battle.battle_status === BATTLE_STATUS.CANCELLED))
    );
    dispatch(
      setNewCreatedBattles(data.filter((battle) => battle.battle_status === BATTLE_STATUS.WAITING))
    );
  };
  const processRealTimeData = (data) => {
    console.log(data, 'real time data');
    if (data?.old) {
      dispatch(removeDeletedBattles(data.old.id));
    }

    if (data.new.battle_status === BATTLE_STATUS.WAITING) {
      dispatch(addNewCreatedBattles(data.new));
      dispatch(setIsInsertNewItem(true));
      if (isNotificatinOn) {
        BattleNotificationSound();
        ShowToaster(TOAST_TYPE.INFO, 'A new game has been created');
      }
    }
    switch (data.new.battle_status) {
      case BATTLE_STATUS.ONGOING:
        dispatch(addOngoingBattles(data.new));
        break;
      case BATTLE_STATUS.COMPLETED:
        dispatch(addEndedBattles(data.new));
        dispatch(removeFromDisputedBattles(data.new['id']));
        dispatch(removeFromOngoingBattles(data.new['id']));
        break;
      case BATTLE_STATUS.DISPUTED:
        dispatch(addDisputedBattles(data.new));
        break;
      case BATTLE_STATUS.CANCELLED:
        dispatch(setCanceledBattles(data.new));
        break;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from(DB_TABLE_NAME.BATTLE)
          .select(`*`)
          .in('battle_status', [
            BATTLE_STATUS.COMPLETED,
            BATTLE_STATUS.ONGOING,
            BATTLE_STATUS.DISPUTED,
            BATTLE_STATUS.CANCELLED,
            BATTLE_STATUS.WAITING,
          ]);

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
      .channel('battle-all-event-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DB_TABLE_NAME.BATTLE,
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
