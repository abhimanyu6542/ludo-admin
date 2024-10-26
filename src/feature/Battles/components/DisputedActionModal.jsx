/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { getBattleUserResponseDataApi, updateBattledataApi } from '../api/battleApi';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { supabase } from '../../../config/supabaseClient';
import { getWalletDataApi } from '../../ManageWallet/api/wallteApi';
import { TOAST_TYPE } from '../../../constants/common';
import { ShowToaster } from '../../../components/Toaster/Toaster';

function DisputedActionModal({ clickEvent, data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [isRefundLoading, setIsRefundLoading] = useState(false);
  const [iscreatorPenalityLoading, setIscreatorPenalityLoading] = useState(false);
  const [isplayerPenalityLoading, setIsplayerPenalityLoading] = useState(false);
  const [battleData, setBattleResponseData] = useState([]);
  const [creatorPenality, setCreatorPenality] = useState();
  const [playerPenality, setPlayerPenality] = useState();
  const [isCreatorImposed, setIsCreatorImposed] = useState(false);
  const [isPlayerImposed, setIsPlayerImposed] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      let battleResponse = await getBattleUserResponseDataApi(data.id);
      setBattleResponseData(battleResponse.data);
      setIsLoading(false);
    }
    fetchData();
  }, [data.id]);

  const creatorData = battleData?.filter((item) => item.user_type === 'creator');
  const playerData = battleData?.filter((item) => item.user_type === 'player');

  useEffect(() => {
    const fetchResponseData = async () => {
      const { data: battle_user_response_data, error: battle_user_response_error } = await supabase
        .from('battle_user_response')
        .select('is_imposed, impose_penality, user_id')
        .match({ battle_id: data.id });

      console.log(battle_user_response_data, 'battle_user_response_data');
      if (battle_user_response_error) {
        setIscreatorPenalityLoading(false);
        throw 'Error while updating game response data';
      }
      const creatorRes = battle_user_response_data.filter(
        (i) => i.user_id === creatorData[0]?.user_id
      )[0];
      const playerRes = battle_user_response_data.filter(
        (i) => i.user_id === playerData[0]?.user_id
      )[0];
      // console.log(creatorRes.is_imposed, 'creatorRes[0] useEffect');
      // console.log(playerRes.is_imposed, 'playerRes[0] useEffect');
      setIsCreatorImposed(creatorRes?.is_imposed || false);
      setIsPlayerImposed(playerRes?.is_imposed || false);
    };
    fetchResponseData();
  }, [isCreatorImposed, isPlayerImposed]);

  const img_url =
    'https://ejwcfznguynlntyuvznp.supabase.co/storage/v1/object/public/user_win_screenshot/';


  const handleCreatorWinner = async () => {
    try {
      setIsCreatorLoading(true);
      // update battle data
      const payload = {
        battle_status: 'completed',
        winner: data?.created_by,
        losser: data?.accepted_by,
        completed_at: new Date().toISOString(),
      };
      const { data: updatebattledata, error: updatebattleError } = await updateBattledataApi(
        data.id,
        payload
      );
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
      win_amount = data.entry_fee + calculated_commission * parseInt(data.entry_fee);
      let availableBalance;
      // get current wallet balnce of thse user
      const walletRes = await getWalletDataApi(creatorData[0].users.phone);
      if (walletRes.error) {
        setIsCreatorLoading(false);
        throw 'Error while fetching wallet data';
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone, referral_code , coin, battles, win_battles, loss_battles, wallet(balance)')
        .eq('user_name', data?.created_by);
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
        })
        .eq('phone', userData[0].phone);

      availableBalance = walletRes.data[0].balance;

      const wallet_obj = {
        balance: availableBalance + Number(win_amount),
        user_id: creatorData[0].users.phone,
      };

      const wallet_txn_obj = {
        amount: win_amount,
        transaction_type: 'battle_won',
        transaction_request_id: null,
        user_id: creatorData[0].users.phone,
        battle_id: data.id,
        closing_balance:wallet_obj.balance,
      };

      const { error } = await supabase.from('wallet_transaction').insert([wallet_txn_obj]);

      if (error) {
        setIsCreatorLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { data: walletdata, error: walletError } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIsCreatorLoading(false);
        throw 'Error while updating wallet data';
      }
      setIsCreatorLoading(false);
      clickEvent();
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
        battle_status: 'completed',
        winner: data?.accepted_by,
        losser: data?.created_by,
        completed_at: new Date().toISOString(),
      };
      const { data: updatebattledata, error: updatebattleError } = await updateBattledataApi(
        data.id,
        payload
      );
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
      win_amount = data.entry_fee + calculated_commission * parseInt(data.entry_fee);

      let availableBalance;
      // get current wallet balnce of thse user
      const walletRes = await getWalletDataApi(playerData[0].users.phone);
      if (walletRes.error) {
        setIsPlayerLoading(false);
        throw 'Error while fetching wallet data';
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone, referral_code , coin, battles, win_battles, loss_battles, wallet(balance)')
        .eq('user_name', data?.accepted_by);
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
        })
        .eq('phone', userData[0].phone);

      availableBalance = walletRes.data[0].balance;

      const wallet_obj = {
        balance: availableBalance + Number(win_amount),
        user_id: playerData[0].users.phone,
      };

      const wallet_txn_obj = {
        amount: win_amount,
        transaction_type: 'battle_won',
        transaction_request_id: null,
        user_id: playerData[0].users.phone,
        battle_id: data.id,
        closing_balance: wallet_obj.balance,
      };
      const { error } = await supabase.from('wallet_transaction').insert([wallet_txn_obj]);

      if (error) {
        setIsPlayerLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { data: walletdata, error: walletError } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIsPlayerLoading(false);
        throw 'Error while updating wallet data';
      }
      setIsPlayerLoading(false);
      clickEvent();
    } catch (error) {
      setIsPlayerLoading(false);
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, error.message);
    }
  };
  const handleRefund = async () => {
    try {
      setIsRefundLoading(true);
      // update battle data
      const payload = {
        battle_status: 'completed',
        completed_at: new Date().toISOString(),
      };
      const { data: updatebattledata, error: updatebattleError } = await updateBattledataApi(
        data.id,
        payload
      );
      if (updatebattleError) {
        throw 'Error while playing the game';
      }

      //   action for player one

      let playerOneavailableBalance;
      // get current wallet balnce of thse user
      const playerOnewalletRes = await getWalletDataApi(creatorData[0].users.phone);
      if (playerOnewalletRes.error) {
        setIsRefundLoading(false);
        throw 'Error while fetching wallet data';
      }

      playerOneavailableBalance = playerOnewalletRes.data[0].balance;

      const playerOneWallet_obj = {
        balance: playerOneavailableBalance + Number(data.entry_fee),
        user_id: creatorData[0].users.phone,
      };

      const playerOne_wallet_txn_obj = {
        amount: data.entry_fee,
        transaction_type: 'refunded',
        transaction_request_id: null,
        user_id: creatorData[0].users.phone,
        battle_id: data.id,
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
      const { data: walletdata, error: walletError } = await supabase
        .from('wallet')
        .upsert(playerOneWallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIsRefundLoading(false);
        throw 'Error while updating wallet data';
      }

      //   action for player two
      let playerTwoavailableBalance;
      // get current wallet balnce of thse user
      const playerTwowalletRes = await getWalletDataApi(playerData[0].users.phone);
      if (playerTwowalletRes.error) {
        throw 'Error while fetching wallet data';
      }

      playerTwoavailableBalance = playerTwowalletRes.data[0].balance;

      const playerTwoWallet_obj = {
        balance: playerTwoavailableBalance + Number(data.entry_fee),
        user_id: playerData[0].users.phone,
      };

      const playerTwo_wallet_txn_obj = {
        amount: data.entry_fee,
        transaction_type: 'refunded',
        transaction_request_id: null,
        user_id: playerData[0].users.phone,
        battle_id: data.id,
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
      const { data: playerTwowalletdata, error: playerTwowalletError } = await supabase
        .from('wallet')
        .upsert(playerTwoWallet_obj, { onConflict: 'user_id' });
      if (playerTwowalletError) {
        setIsRefundLoading(false);
        throw 'Error while updating wallet data';
      }
      setIsRefundLoading(false);
      clickEvent();
    } catch (error) {
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, error.message);
      setIsRefundLoading(false);
    }
  };

  // code for handle imposed penality
  // penality for creator
  const handleCreatorPenality = async () => {
    setIscreatorPenalityLoading(true);

    try {
      if (!creatorPenality) {
        setIscreatorPenalityLoading(false);
        throw 'Amount should not be 0';
      }
      console.log(creatorPenality);
      let availableBalance;
      // get current wallet balnce of thse user
      const walletRes = await getWalletDataApi(creatorData[0].users.phone);
      if (walletRes.error) {
        setIscreatorPenalityLoading(false);
        throw 'Error while fetching wallet data';
      }

      availableBalance = walletRes.data[0].balance;

      const wallet_obj = {
        balance: availableBalance - Number(creatorPenality),
        user_id: creatorData[0].users.phone,
      };

      const wallet_txn_obj = {
        amount: creatorPenality,
        transaction_type: 'imposed_penality',
        transaction_request_id: null,
        user_id: creatorData[0].users.phone,
        battle_id: data.id,
        closing_balance: wallet_obj.balance,
      };

      const { error } = await supabase.from('wallet_transaction').insert([wallet_txn_obj]);

      if (error) {
        setIscreatorPenalityLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { error: walletError } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIscreatorPenalityLoading(false);
        throw 'Error while updating wallet data';
      }
      const respose_payload = {
        is_imposed: true,
        impose_penality: Number(creatorPenality),
      };

      const { error: battle_user_response_error } = await supabase
        .from('battle_user_response')
        .update(respose_payload)
        .match({ battle_id: data.id, user_id: creatorData[0].user_id })
        .select();

      if (battle_user_response_error) {
        setIscreatorPenalityLoading(false);
        throw 'Error while updating game response data';
      }
      setIscreatorPenalityLoading(false);
      setIsCreatorImposed(true);
    } catch (error) {
      setIscreatorPenalityLoading(false);
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, error);
    }
  };
  // penality for player
  const handlePlayerPenality = async () => {
    if (!playerPenality) {
      setIsplayerPenalityLoading(false);
      return;
    }
    console.log(playerPenality);

    setIsplayerPenalityLoading(true);
    try {
      if (!playerPenality) {
        setIsplayerPenalityLoading(false);
        throw 'Amount should not be 0';
      }
      console.log(playerPenality);
      let availableBalance;
      // get current wallet balnce of thse user
      const walletRes = await getWalletDataApi(playerData[0].users.phone);
      if (walletRes.error) {
        setIsplayerPenalityLoading(false);
        throw 'Error while fetching wallet data';
      }

      availableBalance = walletRes.data[0].balance;

      const wallet_obj = {
        balance: availableBalance - Number(playerPenality),
        user_id: playerData[0].users.phone,
      };

      const wallet_txn_obj = {
        amount: playerPenality,
        transaction_type: 'imposed_penality',
        transaction_request_id: null,
        user_id: playerData[0].users.phone,
        battle_id: data.id,
        closing_balance: wallet_obj.balance,
      };
      const { error } = await supabase.from('wallet_transaction').insert([wallet_txn_obj]);

      if (error) {
        setIsplayerPenalityLoading(false);
        throw 'Error while inserting new Transaction';
      }

      // update the wallet balance
      const { data: walletdata, error: walletError } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });
      if (walletError) {
        setIsplayerPenalityLoading(false);
        throw 'Error while updating wallet data';
      }

      const respose_payload = {
        is_imposed: true,
        impose_penality: Number(playerPenality),
      };

      const { error: battle_user_response_error } = await supabase
        .from('battle_user_response')
        .update(respose_payload)
        .match({ battle_id: data.id, user_id: playerData[0].user_id })
        .select();

      if (battle_user_response_error) {
        setIsplayerPenalityLoading(false);
        throw 'Error while updating game response data';
      }

      setIsplayerPenalityLoading(false);
      setIsPlayerImposed(true);
    } catch (error) {
      setIsplayerPenalityLoading(false);
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, error);
    }
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="flex font-poppins flex-col rounded-md border-0 w-[850px] bg-secondary px-7 py-3">
          <div className="flex items-center justify-between py-3 border-tertiary-t4">
            <h1 className="text-xl font-poppins font-medium text-[#1F2937]">Battle Info : </h1>
            <MdOutlineCancel
              onClick={() => clickEvent()}
              className="text-xl cursor-pointer text-primary hover:text-rose-600"
            />
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <BasicSpinner />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3">
                <h1 className="text-black font-poppins font-medium text-base">
                  Entry Fee: {data.entry_fee}{' '}
                </h1>
                <h1 className="text-black font-poppins font-medium text-base">
                  Prize: {data.prize}
                </h1>
              </div>
              <div className="flex justify-between items-center mt-2 gap-5">
                <div className="border-2 w-full h-96 p-4 break-words rounded-lg shadow-md">
                  <h1 className="text-black font-poppins font-medium text-base">
                    Player 1 : <span>{data?.created_by}</span>{' '}
                  </h1>
                  <h1 className="text-black font-poppins font-medium text-base">
                    Match Response :{' '}
                    <span className="">
                      {creatorData[0]?.match_response ? creatorData[0]?.match_response : 'N/A'}
                    </span>{' '}
                  </h1>
                  <div className="flex justify-start gap-3 text-black font-poppins font-medium text-base">
                    Screenshot:
                    <span>
                      {creatorData[0]?.screenshot ? (
                        <img
                          src={img_url + creatorData[0]?.screenshot}
                          alt={creatorData[0].user_id}
                          className="border-green-500 w-64 h-64"
                        />
                      ) : (
                        'N/A'
                      )}
                    </span>{' '}
                  </div>

                  <h1 className="text-black font-poppins font-medium text-base">
                    Remarks :{' '}
                    <span>{creatorData[0]?.remarks ? creatorData[0]?.remarks : 'N/A'}</span>{' '}
                  </h1>
                </div>
                <div className="border-2 w-full h-96 p-4 break-words rounded-lg shadow-md ">
                  <h1 className="text-black font-poppins font-medium text-base">
                    Player 2 : <span>{data?.accepted_by}</span>{' '}
                  </h1>
                  <h1 className="text-black font-poppins font-medium text-base">
                    Match Response :{' '}
                    <span>
                      {playerData[0]?.match_response ? playerData[0]?.match_response : 'N/A'}
                    </span>{' '}
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
              <div className="grid grid-cols-2 justify-between items-center mt-3 gap-8">
                <div className="flex gap-5">
                  {isCreatorImposed ? (
                    <button className="border-2 cursor-not-allowed flex justify-center items-center gap-4 w-full bg-[#000000] text-white px-3 py-1 rounded-md text-base font-medium font-poppins">
                      Penality Imposed
                    </button>
                  ) : (
                    <>
                      {' '}
                      <input
                        type="number"
                        value={creatorPenality}
                        onChange={(e) => setCreatorPenality(e.target.value)}
                        placeholder="Amount"
                        className="border-2 text-center border-black flex justify-center items-center gap-4 w-full  text-black px-3 py-1 rounded-md text-base font-medium font-poppins"
                      />
                      <button
                        onClick={handleCreatorPenality}
                        className="border-2 flex justify-center items-center gap-4 w-full bg-[#000000] text-white px-3 py-1 rounded-md text-base font-medium font-poppins"
                      >
                        {iscreatorPenalityLoading ? 'Please wait..' : 'Impose Penality'}
                        {iscreatorPenalityLoading ? <BasicSpinner /> : null}
                      </button>
                    </>
                  )}
                </div>
                <div className="flex gap-5">
                  {isPlayerImposed ? (
                    <button className="border-2 cursor-not-allowed flex justify-center items-center gap-4 w-full bg-[#000000] text-white px-3 py-1 rounded-md text-base font-medium font-poppins">
                      Penality Imposed
                    </button>
                  ) : (
                    <>
                      <input
                        type="number"
                        value={playerPenality}
                        onChange={(e) => setPlayerPenality(e.target.value)}
                        placeholder="Amount"
                        className="border-2 text-center border-black flex justify-center items-center gap-4 w-full text-black px-3 py-1 rounded-md text-base font-medium font-poppins"
                      />
                      <button
                        onClick={handlePlayerPenality}
                        className="border-2 flex justify-center items-center gap-4 w-full bg-[#000000] text-white px-3 py-1 rounded-md text-base font-medium font-poppins"
                      >
                        {isplayerPenalityLoading ? 'Please wait..' : 'Impose Penality'}
                        {isplayerPenalityLoading ? <BasicSpinner /> : null}
                      </button>
                    </>
                  )}
                </div>
                {/* <button
                  disabled={isCreatorLoading}
                  onClick={handleCreatorWinner}
                  className="border-2 flex justify-center items-center gap-4 w-full bg-[#065F46] text-white px-3 py-1 rounded-md text-base font-medium font-poppins "
                >
                  {isCreatorLoading ? 'Please wait..' : ' Declare “creator” as winner'}
                  {isCreatorLoading ? <BasicSpinner /> : null}
                </button>
                <button
                  disabled={isPlayerLoading}
                  onClick={handlePlayerWinner}
                  className="border-2 flex justify-center items-center gap-4 w-full bg-[#065F46] text-white px-3 py-1 rounded-md text-base font-medium font-poppins "
                >
                  {isPlayerLoading ? 'Please wait..' : ' Declare “Player” as winner'}
                  {isPlayerLoading ? <BasicSpinner /> : null}
                </button> */}
              </div>

              {/* action button  */}
              <div className="flex justify-between items-center my-3 gap-5">
                <button
                  disabled={isCreatorLoading}
                  onClick={handleCreatorWinner}
                  className="border-2 flex justify-center items-center gap-4 w-full bg-[#065F46] text-white px-3 py-1 rounded-md text-base font-medium font-poppins "
                >
                  {isCreatorLoading ? 'Please wait..' : ' Declare “creator” as winner'}
                  {isCreatorLoading ? <BasicSpinner /> : null}
                </button>
                <button
                  disabled={isPlayerLoading}
                  onClick={handlePlayerWinner}
                  className="border-2 flex justify-center items-center gap-4 w-full bg-[#065F46] text-white px-3 py-1 rounded-md text-base font-medium font-poppins "
                >
                  {isPlayerLoading ? 'Please wait..' : ' Declare “Player” as winner'}
                  {isPlayerLoading ? <BasicSpinner /> : null}
                </button>
              </div>
              <button
                disabled={isRefundLoading}
                onClick={handleRefund}
                className="border-2 flex justify-center items-center gap-4 text-center w-full bg-[#ff5b5b] text-white px-3 py-1 rounded-md text-base font-medium font-poppins"
              >
                {isRefundLoading ? 'Please wait..' : ' Refund'}
                {isRefundLoading ? <BasicSpinner /> : null}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DisputedActionModal;
