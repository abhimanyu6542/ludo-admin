import React, { useEffect } from 'react';
import { BsBell } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDisputedBattles,
  addEndedBattles,
  addNewCreatedBattles,
  addOngoingBattles,
  removeDeletedBattles,
  removeFromDisputedBattles,
  removeFromOngoingBattles,
  setCanceledBattles,
  setDisputedBattles,
  setEndedBattles,
  setIsInsertNewItem,
  setIsModalOpen,
  setNewCreatedBattles,
  setOngoingBattles,
} from '../../../slice/battle.slice';
import { BATTLE_STATUS, DB_TABLE_NAME, TOAST_TYPE } from '../../../constants/common';
import {
  AddMoneyNotificationSound,
  BattleNotificationSound,
  WithdrawalNotificationSound,
} from '../../../utils/Search/notifucationSound';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { supabase } from '../../../config/supabaseClient';
import { GoDotFill } from 'react-icons/go';
import {
  addNewWithdrawalData,
  addWithdrawalData,
  setWithdrawalData,
} from '../../../slice/withdrawal.slice';
import { addAddMoneyData, addNewAddMoneyData } from '../../../slice/addMoney.slice';
import addNotification from 'react-push-notification';

function Navbar() {
  const battleState = (state) => state.battle;
  const managedUser = useSelector((state) => state.user.managed_user) || [];

  const userNames = managedUser?.map((user) => user.user_name) || null;
  const { isInsertNewItem, isNotificatinOn } = useSelector(battleState);
  const dispatch = useDispatch();

  // Function to request permission
  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          } else {
            console.log('Notification permission denied.');
          }
        })
        .catch(error => console.error("Error requesting notification permission:", error));
    }
  };

  // Function to send a notification
  const sendNotification = (data) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(data.title, {
        body: data.message,
        icon: "https://ejwcfznguynlntyuvznp.supabase.co/storage/v1/object/public/icon/icon-96.webp"  // Optional icon URL
      });
  
      notification.onclick = () => {
        window.open(
          data.type === 'recharge'
            ? 'https://admin.babaludoclub.in/add-money'
            : 'https://admin.babaludoclub.in/withdrawal',
          '_blank'
        );
      };
    } else {
      console.warn('Notification permission is not granted.');
    }
  };

  useEffect(() => {
    // Request permission when the component mounts
    requestNotificationPermission();
  }, []);

  // battle section
  const processBattleData = (data) => {
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

  const processBattleRealTimeData = (data) => {
    console.log(data, 'real time battle data');
    if (data?.old) {
      dispatch(removeDeletedBattles(data.old.id));
    }
    if (data.eventType === 'INSERT') {
      if (data.new.battle_status === BATTLE_STATUS.WAITING) {
        dispatch(addNewCreatedBattles(data.new));
        dispatch(setIsInsertNewItem(true));
        if (isNotificatinOn) {
          BattleNotificationSound();
          const payload = {
            title: 'Game created',
            message: `A new game has been created by ${data.new.created_by}`,
            type: 'game creted',
          };
          sendNotification(payload);
          ShowToaster(TOAST_TYPE.INFO, 'A new game has been created');
        }
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
    if (data.eventType === 'UPDATE') {
      if (data.new.accepted_by) {
        const createdByManagedUser = userNames.includes(data.new.created_by);
        if (createdByManagedUser) {
          if (isNotificatinOn) {
            BattleNotificationSound();
            const payload = {
              title: 'Game Accepted',
              message: `Game Id ${data.new.id} has been accepted by ${data.new.accepted_by}`,
              type: 'game Accepted',
            };
            sendNotification(payload);
            ShowToaster(
              TOAST_TYPE.INFO,
              `Game Id ${data.new.id} has been accepted by ${data.new.accepted_by}`
            );
          }
        }
      }
    }
  };
  const fetchBattleData = async () => {
    try {
      const { data, error } = await supabase
        .from(DB_TABLE_NAME.BATTLE)
        .select('*')
        .in('battle_status', [
          BATTLE_STATUS.COMPLETED,
          BATTLE_STATUS.ONGOING,
          BATTLE_STATUS.DISPUTED,
          BATTLE_STATUS.CANCELLED,
          BATTLE_STATUS.WAITING,
        ]);

      if (error) throw error;
      processBattleData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWithdrawalData = async () => {
    try {
      const { data, error } = await supabase
        .from(DB_TABLE_NAME.TRANSACTION_REQUEST)
        .select('id, created_at, amount, utr_no, transfer_preference, status, type, user_id')
        .match({ type: 'withdrawn' });

      if (error) throw error;
      processData(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchBattleData();
    fetchWithdrawalData();
  }, []);

  supabase
    .channel('battle-all-event-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: DB_TABLE_NAME.BATTLE },
      (payload) => {
        processBattleRealTimeData(payload);
      }
    )
    .subscribe();

  useEffect(() => {
    if (isInsertNewItem) {
      // Reset isInsertNewItem to false after a delay or some logic
      const timer = setTimeout(() => {
        dispatch(setIsInsertNewItem(false));
      }, 6000); // Example delay of 6 seconds

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [isInsertNewItem]);

  // withdrawal and add money section
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
          if (isNotificatinOn) {
            WithdrawalNotificationSound();
            const payload = {
              title: 'withdrawal',
              message: `A new withdrawal request has been received from ${data.new.user_id}`,
              type: 'withdrawal',
            };
            sendNotification(payload);
            ShowToaster(TOAST_TYPE.INFO, 'A new withdrawal request has been received');
          }
        }
        if (data.new['type'] == 'add') {
          dispatch(addNewAddMoneyData(data.new));
          dispatch(addAddMoneyData(data.new));
          if (isNotificatinOn) {
            AddMoneyNotificationSound();
            const payload = {
              title: 'Add money to wallet',
              message: `A new add money request has been received from ${data.new.user_id}`,
              type: 'recharge',
            };
            sendNotification(payload);
            ShowToaster(TOAST_TYPE.INFO, 'A new add money request has been received');
          }
        }

        break;
      case 'UPDATE':
        if (data.new['type'] == 'withdrawn') {
          dispatch(addWithdrawalData(data.new));
        }
        break;
    }
    dispatch(setIsInsertNewItem(true));
  };

  supabase
    .channel('transaction_request-all-event-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: DB_TABLE_NAME.TRANSACTION_REQUEST },
      (payload) => {
        processRealTimeData(payload);
      }
    )
    .subscribe();
  return (
    <>
      <div className="flex h-11 w-full items-center justify-end bg-secondary px-3">
        <div className=" flex items-center">
          <div
            className="relative mr-10 mt-10 mb-4 cursor-pointer"
            onClick={() => dispatch(setIsModalOpen(true))}
          >
            <BsBell className="text-base w-7 h-7 text-gray5" />
            {isInsertNewItem ? (
              <GoDotFill className="text-red-600 -mt-5 ml-1.5 absolute animate-ping" />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
