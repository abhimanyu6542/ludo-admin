/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { supabase } from '../../../config/supabaseClient';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { queryClient } from '../../../config/react-query';
import { GET_USERS_QUERY_KEY } from '../constants/userQueryKey';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';

function SubtractBalanceModal({ clickEvent, name, phone, availableBalance }) {
  const [amount, setAmount] = useState();
  const [isAmountEmpty, setisAmountEmpty] = useState(false);
  const [isAmountGratorThanBalnce, setisAmountGratorThanBalnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    console.log(availableBalance, Number(amount), 'gfyf')
    if (!amount) {
      setisAmountEmpty(true);
      return;
    }
    if(availableBalance < Number(amount) ){
      setisAmountGratorThanBalnce(true);
      return;
    }
    try {
      setIsLoading(true)
      setisAmountEmpty(false);
   
      const wallet_obj = {
        balance: availableBalance - Number(amount),
        user_id: phone,
      };

      // update the balance
      const { data: walletdata, error: walletError } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });

      if (walletError) {
        throw new Error('Error while updating wallet data');
      }
      const wallet_txn_obj = {
        amount: amount,
        closing_balance: (Number(availableBalance) - Number(amount)).toFixed(2),
        transaction_type: 'admin_debit',
        transaction_request_id: null,
        user_id: phone,
      };
      await supabase.from('wallet_transaction').insert([wallet_txn_obj]);
      await queryClient.refetchQueries({
        queryKey: [GET_USERS_QUERY_KEY],
      });
      setIsLoading(false)
      clickEvent()
      ShowToaster(TOAST_TYPE.SUCCESS, 'Amount deducted successfully');
    } catch (error) {
      console.log(error);
      setIsLoading(false)
      ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
    }
  };

  // let availableBalance;
  // // get current wallet balnce of thse user
  // const walletRes = await getWalletDataApi(userData[0].phone);
  // if (walletRes.error) {
  //   throw new Error("Error while fetching wallet data");
  // }

  // availableBalance = walletRes.data[0].balance;

  // const wallet_obj = {
  //   balance: availableBalance + Number(battleData[0].entry_fee),
  //   user_id: userData[0].phone,
  // };

  // // update the balance
  // const { data: walletdata, error: walletError } = await supabase
  //   .from("wallet")
  //   .upsert(wallet_obj, { onConflict: "user_id" });

  // if (walletError) {
  //   throw new Error("Error while updating wallet data");
  // }
  // const wallet_txn_obj = {
  //   amount: battleData[0].entry_fee,
  //   closing_balance: Number(
  //     availableBalance + battleData[0].entry_fee
  //   ).toFixed(2),
  //   transaction_type: "battle_entry_fee_refunded",
  //   transaction_request_id: null,
  //   user_id: userData[0].phone,
  //   battle_id: battleData[0].id,
  // };
  // await supabase.from("wallet_transaction").insert([wallet_txn_obj]);
  return (
    <>
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="flex font-poppins flex-col rounded-md border-0 w-[550px] bg-secondary px-12 py-5">
          <div className="flex items-center justify-between py-3 border-tertiary-t4">
            <h1 className="text-xl font-poppins font-medium text-[#1F2937]">
             Deduct Money from User :{' '}
              <span className="text-xl font-semibold text-center text-[#EF4444]">{name}</span>{' '}
            </h1>
            <MdOutlineCancel
              onClick={() => clickEvent()}
              className="text-xl cursor-pointer text-primary hover:text-rose-600"
            />
          </div>
          <h1>Enter Amount to be deducted</h1>
          <div className="flex flex-col gap-5 mt-5">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="w-full px-5 py-3 text-base text-black border-2 rounded-md outline-none resize-none border-tertiary-t4 focus:border-primary"
            />
            {isAmountEmpty && (
              <small className="text-xs font-semibold text-red-500 ">Amount is required</small>
            )}
            {isAmountGratorThanBalnce && (
              <small className="text-xs font-semibold text-red-500 ">{`Amount Can't be grator than Available balance`}</small>
            )}
            <div className="flex gap-3 ">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className=" bg-[#e04242] text-white px-3 py-1  flex gap-2 rounded text-base font-medium font-poppins"
              >
                 {isLoading ? 'Please wait..' : 'Confirm'}
                  {isLoading && (
                    <BasicSpinner className="ml-4 justify-items-end leading-[12px] text-zinc-100" />
                  )}
              </button>
              <button
                onClick={() => clickEvent()}
                className="bg-[#9CA3AF] text-white px-3 py-1 rounded text-base font-medium font-poppins"
              >
                Cancel
              </button>
              {/* <LoadingSpinner /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubtractBalanceModal;
