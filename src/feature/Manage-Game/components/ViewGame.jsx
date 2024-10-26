import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentBattles } from '../../../slice/battle.slice';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { supabase } from '../../../config/supabaseClient';
import { BATTLE_STATUS, DB_TABLE_NAME, TOAST_TYPE } from '../../../constants/common';
import { deleteBattleApi, updateBattledataApi } from '../../Battles/api/battleApi';
import { getWalletDataApi } from '../../ManageWallet/api/wallteApi';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import axios from 'axios';
import IWonModal from './IWonModal';
import ILostModal from './ILostModal';
import { queryClient } from '../../../config/react-query';
import { GET_ALL_BATTLE_QUERY_KEY } from '../../Users/constants/userQueryKey';
import CountDownTimer from '../../../utils/Search/CountDownTimer';

const ViewGame = () => {
  const current_battles = useSelector((state) => state.battle.current_battles);
  const allBattleResponse = useSelector((state) => state.battle.allBattleResponse);
  const [isIWonModalOpen, setIsIWonModalOpen] = useState(false);
  const [isILostModalOpen, setIsILostModalOpen] = useState(false);
  const jwt_token = useSelector((state) => state.auth.session.access_token) || null;
  const all_user = useSelector((state) => state.user.all_user) || [];
  const managedUser = useSelector((state) => state.user.managed_user) || [];

  const filteredUser = managedUser?.filter(
    (item) => item.user_name !== current_battles?.created_by
  );
  const userExists = (userName) => managedUser.some((user) => user.user_name === userName);

  const usersNotPlaying = filteredUser.filter((item) => item.is_playing === false);
  const isAcceptedByManagedUser = userExists(current_battles.accepted_by);

  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isReject, setisReject] = useState(false);
  const [creatorData, setCreatorData] = useState();
  const [user, setUser] = useState(null); // Initial user state is null
  const [roomCode, setRoomCode] = useState(current_battles?.room_code || '');
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [isRefundLoading, setIsRefundLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const img_url =
    'https://ejwcfznguynlntyuvznp.supabase.co/storage/v1/object/public/user_win_screenshot/';
  // Effect to set the initial user based on current_battles.accepted_by
  useEffect(() => {
    if (current_battles?.accepted_by) {
      const acceptedUser = all_user.find((item) => item.user_name === current_battles.accepted_by);
      setUser(acceptedUser || null); // Set accepted user if found, else null
    }
  }, [current_battles, all_user]);

  // get creator info
  useEffect(() => {
    async function getUser() {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone, referral_code , coin, battles, win_battles, loss_battles, wallet(balance)')
        .eq('user_name', current_battles?.created_by);
      if (userError) {
        console.log('Error while fetching username');
      }

      setCreatorData(userData);
    }
    getUser();
  }, []);

  // get live current battle data

  useEffect(() => {
    if (current_battles) {
      const subscriptions = supabase
        .channel('battle-all-event-channel')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: DB_TABLE_NAME.BATTLE,
            filter: `id=eq.${current_battles.id}`,
          },
          (payload) => {
            console.log(payload.new, 'from view game')
            dispatch(setCurrentBattles(payload.new));
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(subscriptions);
      };
    }
  }, []);

  function handleDropDown(e) {
    const selectedUser = usersNotPlaying.find((item) => item.user_name === e.target.value);
    setUser(selectedUser); // Set the full user object
  }

  const handleBack = () => {
    dispatch(setCurrentBattles(null));
    navigate('/manage-game');
  };

  const playGame = async () => {
    if (!user) {
      ShowToaster(TOAST_TYPE.ERROR, 'Please select user to play');
      return;
    }
    if (!roomCode) {
      ShowToaster(TOAST_TYPE.ERROR, `Room Code cann't be empty`);
      return;
    }

    try {
      setIsLoading(true);

      await supabase
        .from(DB_TABLE_NAME.BATTLE)
        .update({
          battle_status: BATTLE_STATUS.ONGOING,
          room_code_confirmed_by_creator: true,
          room_code: roomCode,
          room_code_confirmed_by_player: true,
          request_accepted: true,
          accepted_by: user?.user_name,
        })
        .eq('id', current_battles.id);

      const isBannedUser = user.is_banned;
      if (isBannedUser) {
        console.log(isBannedUser, '--> isBannedUser');
        throw new Error('User banned');
      }

      if (user?.is_managed) {
        let availableBalance;
        // get current wallet balnce of thse user
        const walletRes = await getWalletDataApi(user.phone);
        if (walletRes.error) {
          throw new Error('Error while fetching wallet data');
        }

        availableBalance = walletRes.data[0].balance;

        if (current_battles.entry_fee > availableBalance) {
          throw new Error('You have not sufficient balance to play the game');
        }

        const wallet_obj = {
          balance: availableBalance - Number(current_battles.entry_fee),
          user_id: user.phone,
        };

        // update the balance
        const { error: walletError } = await supabase
          .from('wallet')
          .upsert(wallet_obj, { onConflict: 'user_id' });
        if (walletError) {
          throw new Error('Error while updating wallet data');
        }
        const wallet_txn_obj = {
          amount: current_battles.entry_fee,
          closing_balance: Number(availableBalance - current_battles.entry_fee).toFixed(2),
          transaction_type: 'battle_entry_fee',
          transaction_request_id: null,
          user_id: user.phone,
          battle_id: current_battles.id,
        };
        await supabase.from('wallet_transaction').insert([wallet_txn_obj]);
      }
      await supabase.from('users').update({ is_playing: true }).eq('phone', user.phone);
      await axios.post(
        "https://rupbhkrgwi.execute-api.ap-south-1.amazonaws.com/api/v1/timer-game-delete",
        {
          jwt_token,
          game_id: current_battles.id,
        }
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ShowToaster(TOAST_TYPE.ERROR, 'Please select user to play');
    }
  };

  const playerData = allBattleResponse.filter(
    (item) => item.user_type === 'player' && item.battle_id === current_battles.id
  );

  const handleCreatorWinner = async () => {
    try {
      setIsCreatorLoading(true);
      // update battle data
      const payload = {
        battle_status: BATTLE_STATUS.COMPLETED,
        winner: current_battles?.created_by,
        losser: current_battles?.accepted_by,
        completed_at: new Date().toISOString(),
      };
      const { error: updatebattleError } = await updateBattledataApi(current_battles?.id, payload);
      if (updatebattleError) {
        setIsCreatorLoading(false);

        throw 'Something went wrong';
      }

      // get game_commission
      const { data: commision_data, error: commision_error } = await supabase
        .from('app_setting')
        .select('game_commission');
      if (commision_error) {
        throw new Error('Commissin not found');
      }
      let game_commission = commision_data[0].game_commission || 0;
      console.log(game_commission);
      const calculated_commission = (100 - game_commission) / 100;
      //calculating win amount
      let win_amount = 0;
      win_amount =
        current_battles.entry_fee + calculated_commission * parseInt(current_battles.entry_fee);
      let availableBalance;
      // get current wallet balnce of thse user
      const walletRes = await getWalletDataApi(creatorData[0].phone);
      if (walletRes.error) {
        setIsCreatorLoading(false);
        throw 'Error while fetching wallet data';
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone, referral_code , coin, battles, win_battles, loss_battles, wallet(balance)')
        .eq('user_name', current_battles?.created_by);
      if (userError) {
        console.log('Error while fetching username');
      }
      console.log('User data', userData);

      const { error: update_coin_error } = await supabase
        .from('users')
        .update({
          coin: Number(Number(userData[0].coin) + win_amount).toFixed(2),
          battles: Number(Number(userData[0].battles) + 1),
          win_battles: Number(Number(userData[0].win_battles) + 1),
          is_playing: false,
        })
        .eq('phone', userData[0].phone);
      await supabase
        .from('users')
        .update({ is_playing: false })
        .eq('user_name', current_battles?.accepted_by);
      availableBalance = walletRes.data[0].balance;

      const wallet_obj = {
        balance: availableBalance + Number(win_amount),
        user_id: creatorData[0].phone,
      };

      const wallet_txn_obj = {
        amount: win_amount,
        transaction_type: 'battle_won',
        transaction_request_id: null,
        user_id: creatorData[0].phone,
        battle_id: current_battles.id,
        closing_balance: wallet_obj.balance,
      };

      const { error } = await supabase.from('wallet_transaction').insert([wallet_txn_obj]);

      if (error) {
        setIsCreatorLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { error: walletError } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIsCreatorLoading(false);
        throw 'Error while updating wallet data';
      }
      setIsCreatorLoading(false);
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_BATTLE_QUERY_KEY],
      });
      handleBack();
    } catch (error) {
      setIsCreatorLoading(false);
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, error.message);
    }
  };
  const handlePlayerWinner = async () => {
    try {
      setIsPlayerLoading(true);
      // update battle data
      const payload = {
        battle_status: BATTLE_STATUS.COMPLETED,
        winner: current_battles?.accepted_by,
        losser: current_battles?.created_by,
        completed_at: new Date().toISOString(),
      };
      const { error: updatebattleError } = await updateBattledataApi(current_battles.id, payload);
      if (updatebattleError) {
        throw 'Error while playing the game';
      }

      // get game_commission
      const { data: commision_data, error: commision_error } = await supabase
        .from('app_setting')
        .select('game_commission');
      if (commision_error) {
        throw new Error('Commissin not found');
      }
      let game_commission = commision_data[0].game_commission || 0;
      console.log(game_commission);
      const calculated_commission = (100 - game_commission) / 100;
      //calculating win amount
      let win_amount = 0;
      win_amount =
        current_battles.entry_fee + calculated_commission * parseInt(current_battles.entry_fee);

      let availableBalance;
      // get current wallet balnce of thse user
      const walletRes = await getWalletDataApi(user.phone);
      if (walletRes.error) {
        setIsPlayerLoading(false);
        throw 'Error while fetching wallet data';
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone, referral_code , coin, battles, win_battles, loss_battles, wallet(balance)')
        .eq('user_name', current_battles?.accepted_by);
      if (userError) {
        console.log('Error while fetching username');
      }
      console.log('User data', userData);

      const { error: update_coin_error } = await supabase
        .from('users')
        .update({
          coin: Number(Number(userData[0].coin) + win_amount).toFixed(2),
          battles: Number(Number(userData[0].battles) + 1),
          win_battles: Number(Number(userData[0].win_battles) + 1),
          is_playing: false,
        })
        .eq('phone', userData[0].phone);
      await supabase
        .from('users')
        .update({ is_playing: false })
        .eq('user_name', current_battles?.created_by);
      availableBalance = walletRes.data[0].balance;

      const wallet_obj = {
        balance: availableBalance + Number(win_amount),
        user_id: user.phone,
      };

      const wallet_txn_obj = {
        amount: win_amount,
        transaction_type: 'battle_won',
        transaction_request_id: null,
        user_id: user.phone,
        battle_id: current_battles.id,
        closing_balance: wallet_obj.balance,
      };
      const { error } = await supabase.from('wallet_transaction').insert([wallet_txn_obj]);

      if (error) {
        setIsPlayerLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { error: walletError } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIsPlayerLoading(false);
        throw 'Error while updating wallet data';
      }
      setIsPlayerLoading(false);
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_BATTLE_QUERY_KEY],
      });
      handleBack();
    } catch (error) {
      setIsPlayerLoading(false);
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, error.message);
    }
  };
  const handleRefund = async () => {
    console.log('refund');
    try {
      setIsRefundLoading(true);
      // update battle data
      const payload = {
        battle_status: BATTLE_STATUS.COMPLETED,
        completed_at: new Date().toISOString(),
      };
      const { error: updatebattleError } = await updateBattledataApi(current_battles.id, payload);
      if (updatebattleError) {
        throw 'Error while playing the game';
      }

      //   action for player one

      let playerOneavailableBalance;
      // get current wallet balnce of thse user
      const playerOnewalletRes = await getWalletDataApi(creatorData[0].phone);
      if (playerOnewalletRes.error) {
        setIsRefundLoading(false);
        throw 'Error while fetching wallet data';
      }

      playerOneavailableBalance = playerOnewalletRes.data[0].balance;

      const playerOneWallet_obj = {
        balance: playerOneavailableBalance + Number(current_battles.entry_fee),
        user_id: creatorData[0].phone,
      };

      const playerOne_wallet_txn_obj = {
        amount: current_battles.entry_fee,
        transaction_type: 'refunded',
        transaction_request_id: null,
        user_id: creatorData[0].phone,
        battle_id: current_battles.id,
        closing_balance: playerOneWallet_obj.balance,
      };
      const { error } = await supabase
        .from('wallet_transaction')
        .insert([playerOne_wallet_txn_obj]);

      if (error) {
        setIsRefundLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { error: walletError } = await supabase
        .from('wallet')
        .upsert(playerOneWallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIsRefundLoading(false);
        throw 'Error while updating wallet data';
      }
      await supabase
        .from('users')
        .update({ is_playing: false })
        .eq('user_name', current_battles?.created_by);
      await supabase
        .from('users')
        .update({ is_playing: false })
        .eq('user_name', current_battles?.accepted_by);
      //   action for player two
      let playerTwoavailableBalance;
      // get current wallet balnce of thse user
      const playerTwowalletRes = await getWalletDataApi(user.phone);
      if (playerTwowalletRes.error) {
        throw 'Error while fetching wallet data';
      }

      playerTwoavailableBalance = playerTwowalletRes.data[0].balance;

      const playerTwoWallet_obj = {
        balance: playerTwoavailableBalance + Number(current_battles.entry_fee),
        user_id: user.phone,
      };

      const playerTwo_wallet_txn_obj = {
        amount: current_battles.entry_fee,
        transaction_type: 'refunded',
        transaction_request_id: null,
        user_id: user.phone,
        battle_id: current_battles.id,
        closing_balance: playerTwoWallet_obj.balance,
      };
      const { error: playerTwo_wallet_transaction } = await supabase
        .from('wallet_transaction')
        .insert([playerTwo_wallet_txn_obj]);

      if (playerTwo_wallet_transaction) {
        setIsRefundLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { error: playerTwowalletError } = await supabase
        .from('wallet')
        .upsert(playerTwoWallet_obj, { onConflict: 'user_id' });
      if (playerTwowalletError) {
        setIsRefundLoading(false);
        throw 'Error while updating wallet data';
      }
      setIsRefundLoading(false);
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_BATTLE_QUERY_KEY],
      });
      handleBack();
    } catch (error) {
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, error.message);
      setIsRefundLoading(false);
    }
  };

  const OnReject = async () => {
    try {
      setisReject(true);
      console.log(jwt_token, 'jwt_token');
      const gameRejectRes = await axios.post(
        'https://rupbhkrgwi.execute-api.ap-south-1.amazonaws.com/api/v1/game-reject',
        {
          jwt_token,
          game_id: current_battles.id,
        }
      );

      console.log(gameRejectRes, 'gameRejectRes');
      setisReject(false);
    } catch (error) {
      setisReject(false);
      console.log(error);
    }
  };

  const handleDeleteBattle = async () => {
    console.log('delete');
    const battle_obj = {
      id: current_battles.id,
      jwt_token: jwt_token,
    };
    setIsDelete(true);
    try {
      await deleteBattleApi(battle_obj);
      setIsDelete(false);
      await supabase
        .from('users')
        .update({ is_playing: false })
        .eq('user_name', current_battles?.created_by);
      ShowToaster(TOAST_TYPE.SUCCESS, 'Game has been successfully Deleted ');
      handleBack();
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_BATTLE_QUERY_KEY],
      });
    } catch (error) {
      setIsDelete(false);
      console.log('error', error.response.data.error.message);
      if (error.response.data.error.message) {
        ShowToaster(TOAST_TYPE.ERROR, error.response.data.error.message);
      }
    }
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-start w-full">
        <div
          onClick={handleBack}
          className="flex border-2 w-fit cursor-pointer items-center p-1 px-2 rounded-md font-medium text-xl font-title text-[#1F2937]"
        >
          BACK
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex border-2 rounded-lg p-6 flex-col justify-center w-[500px] gap-3">
          <div className="flex justify-between">
            <div className="flex">
              <p className="font-poppins">Game Id : </p>
              <p className="font-poppins ml-5"> {current_battles?.id} </p>
            </div>
            <div className="flex">
              {/* <p className="font-poppins">Game Id : </p> */}
              <p className="font-poppins ml-5"> <CountDownTimer startDateTime={current_battles?.created_at} /> </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <p className="font-poppins">Entry Fee : </p>
              <p className="font-poppins capitalize ml-5"> {current_battles?.entry_fee} </p>
            </div>
            <div className="flex">
              <p className="font-poppins">Prize : </p>
              <p className="font-poppins capitalize ml-5"> {current_battles?.prize} </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <p className="font-poppins">Creator : </p>
              <p className="font-poppins capitalize ml-5"> {current_battles?.created_by} </p>
            </div>

            <div className="flex">
              {current_battles.accepted_by ? (
                <p className="font-poppins">Player : </p>
              ) : (
                <p className="font-poppins">Set Player : </p>
              )}

              {current_battles.accepted_by ? (
                <p className="font-poppins capitalize ml-5"> {current_battles?.accepted_by} </p>
              ) : (
                <strong className="font-medium">
                  <select
                    disabled={current_battles.accepted_by}
                    className="w-full ml-2 px-10 py-2 text-sm border rounded-md outline-none cursor-pointer"
                    id="user"
                    name="user"
                    value={user?.user_name || ''} // Set dropdown value based on user
                    onChange={handleDropDown}
                  >
                    <option value="" disabled>
                      Select a user
                    </option>
                    {usersNotPlaying.map((i) => (
                      <option key={i.user_name} value={i.user_name}>
                        {i.user_name}
                      </option>
                    ))}
                  </select>
                </strong>
              )}
            </div>
          </div>

          <div className="flex">
            <p className="font-poppins">Status : </p>
            <p className="font-poppins capitalize ml-5"> {current_battles?.battle_status} </p>
          </div>

          <div className="flex">
            <p className="font-poppins ml-5">Room Code : </p>
            <input
              disabled={current_battles?.room_code}
              type="text"
              className="ml-2 uppercase w-44 px-5 py-2 text-sm border rounded-md outline-none"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
            />
          </div>

          <div className="flex justify-center items-center gap-3">
            {current_battles.accepted_by &&
            current_battles.battle_status == BATTLE_STATUS.WAITING ? (
              <div className="flex items-center gap-4 mt-1">
                <button
                  onClick={OnReject}
                  disabled={isReject}
                  className="px-6 h-9 font-semibold text-white bg-red-500 border-0 rounded-sm"
                >
                  {isReject ? 'Rejecting..' : 'Reject'}
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex justify-center items-center gap-3">
            {current_battles.room_code_confirmed_by_creator &&
            current_battles.room_code_confirmed_by_player ? null : (
              <button
                onClick={playGame}
                className="px-3 py-2 border-2 flex justify-center bg-[#065F46] text-[#FFFFFF] rounded-md"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <p>Please wait..</p>
                    <BasicSpinner />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">Play Game</div>
                )}
              </button>
            )}

            {/* action button  */}
            {isAcceptedByManagedUser === true &&
            current_battles.room_code_confirmed_by_creator &&
            current_battles.room_code_confirmed_by_player ? (
              <div>
                {!current_battles.room_code_confirmed_by_creator &&
                !current_battles.room_code_confirmed_by_player ? null : (
                  <div className="flex justify-between items-center my-3 gap-5">
                    <button
                      disabled={isCreatorLoading}
                      onClick={handleCreatorWinner}
                      className="border-2 flex justify-center items-center gap-4 w-full h-12 bg-[#065F46] text-white px-3 py-1 rounded-md"
                    >
                      {isCreatorLoading ? 'Please wait..' : 'Declare Creator as winner'}
                      {isCreatorLoading ? <BasicSpinner /> : null}
                    </button>
                    {current_battles?.accepted_by ? (
                      <button
                        disabled={isPlayerLoading}
                        onClick={handlePlayerWinner}
                        className="border-2 flex justify-center items-center gap-4 w-full h-12 bg-[#065F46] text-white px-3 py-1 rounded-md"
                      >
                        {isPlayerLoading ? 'Please wait..' : ' Declare Player as winner'}
                        {isPlayerLoading ? <BasicSpinner /> : null}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            ) : current_battles.room_code_confirmed_by_creator &&
              current_battles.room_code_confirmed_by_player ? (
              <div className="flex justify-center gap-3 item-center">
                <button
                  onClick={() => setIsIWonModalOpen(true)}
                  className="px-5 py-1 text-base font-bold text-white bg-green-500 border-0 rounded-md"
                >
                  I won
                </button>
                <button
                  onClick={() => setIsILostModalOpen(true)}
                  className="px-5 py-1 text-base font-bold text-white bg-red-500 border-0 rounded-md"
                >
                  I lost
                </button>
              </div>
            ) : null}
          </div>
          <button
            disabled={isRefundLoading || isDelete}
            onClick={current_battles.accepted_by ? handleRefund : handleDeleteBattle}
            className="border-2 flex justify-center items-center gap-4 text-center w-full bg-[#ff5b5b] text-white px-3 py-1 rounded-md text-base font-medium font-poppins"
          >
            {isRefundLoading || isDelete
              ? 'Please wait..'
              : current_battles.accepted_by
              ? ' Refund'
              : 'Delete'}
            {isRefundLoading || isDelete ? <BasicSpinner /> : null}
          </button>
        </div>
      </div>

      {playerData[0]?.match_response ? (
        <div className="flex justify-center mt-6">
          <div className="border-2 w-[500px] p-4 break-words rounded-lg shadow-md ">
            <h1 className="text-black font-poppins font-medium text-base">
              Player 2 : <span>{current_battles?.accepted_by}</span>{' '}
            </h1>
            <h1 className="text-black font-poppins font-medium text-base">
              Match Response :{' '}
              <span>{playerData[0]?.match_response ? playerData[0]?.match_response : 'N/A'}</span>{' '}
            </h1>
            <div className="flex justify-start gap-3 text-black font-poppins font-medium text-base">
              Screenshot:
              <span>
                {playerData[0]?.screenshot ? (
                  <img
                    src={img_url + playerData[0]?.screenshot}
                    alt={playerData[0].user_id}
                    className="border-green-500 w-64 h-64"
                  />
                ) : (
                  'N/A'
                )}
              </span>{' '}
            </div>
            <h1 className="text-black font-poppins font-medium text-base">
              Remarks : <span>{playerData[0]?.remarks ? playerData[0]?.remarks : 'N/A'}</span>{' '}
            </h1>
          </div>
        </div>
      ) : null}

      {/* -- displaying modals */}
      {isIWonModalOpen ? <IWonModal setIsIWonModalOpen={setIsIWonModalOpen} /> : null}
      {isILostModalOpen ? <ILostModal setIsILostModalOpen={setIsILostModalOpen} /> : null}
    </div>
  );
};

export default ViewGame;
