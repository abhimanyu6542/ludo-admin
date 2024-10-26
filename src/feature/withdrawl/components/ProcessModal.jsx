/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  fetchWalletDataApi,
  updateWalletDataApi,
  updateWalletTransactionDataApi,
  updateTransactionRequestDataApi,
  fetchBankDataApi,
} from '../api/walletApi';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { MdOutlineCancel } from 'react-icons/md';
import WithdrawalDeleteModal from './WithdrawalDeleteModal';
import { useDispatch } from 'react-redux';
import { removeFromWithdrawalNotification } from '../../../slice/withdrawal.slice';
import { setIsModalOpen } from '../../../slice/battle.slice';

function ProcessModal({ row_data, setOpenProcessModal }) {
  console.log('row_data -> ', row_data);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [fetchedBankData, setFetchedBankData] = useState();
  const [fetchedWalletData, setFetchedWalletData] = useState();
  const [inputUTRnumber, setInputUTRnumber] = useState();
  const [isInputFieldEmpty, setIsInputFieldEmpty] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch()
  useEffect(() => {
    const handleFetchWalletBalance = async () => {
      const { data: wallet_data, error: wallet_error } = await fetchWalletDataApi(
        parseInt(row_data.user_id)
      );
      if (wallet_error) {
        console.log('Error while fetching wallet data');
      } else if (wallet_data) {
        // console.log('wallet_data -> ', wallet_data);
        setFetchedWalletData(wallet_data[0]);
      }
    };
    handleFetchWalletBalance();
  }, []);
  useEffect(() => {
    const handleFetchBankBalance = async () => {
      const { data: bank_data, error: bank_error } = await fetchBankDataApi(
        parseInt(row_data.user_id)
      );
      if (bank_error) {
        console.log('Error while fetching bank data');
      } else if (bank_data) {
        // console.log('bank_data -> ', wallet_data);
        setFetchedBankData(bank_data[0]);
        setIsDataLoading(false);
      }
    };
    handleFetchBankBalance();
  }, []);
  // console.log(isDataLoading);
  useEffect(() => {
    if (inputUTRnumber) {
      setIsInputFieldEmpty(true);
    }
    // setIsDataLoading(false);
  }, [inputUTRnumber]);

  const handleProcessData = async () => {
    if (isInputFieldEmpty) {
      setIsLoading(true);
      // -- 1 insert new row in "wallet_transaction" table
      const walletTransactionObject = {
        closing_balance: fetchedWalletData.balance - row_data.amount,
      };
      const { error: wallet_transaction_error } = await updateWalletTransactionDataApi(
        row_data.id, walletTransactionObject
      );
      if (wallet_transaction_error) {
        console.log('Error while updating data in wallet transaction');
        setIsLoading(false);
      }

      // -- 2 updating the data in "wallet" table
      const walletObject = {
        balance: fetchedWalletData.balance - row_data.amount,
        total_amount_withdrawn: fetchedWalletData.total_amount_withdrawn + row_data.amount,
        user_id: row_data.user_id,
      };
      const { data: wallet_data, error: wallet_error } = await updateWalletDataApi(walletObject);
      if (wallet_error) {
        console.log('Error while inserting data in wallet');
        setIsLoading(false);
      } else if (wallet_data) {
        ShowToaster(TOAST_TYPE.SUCCESS, 'Data is inserted in Wallet ');
        setIsLoading(false);
      }

      // -- 3 updating the data in "transaction request" table
      const transactionRequestOjbect = {
        id: row_data.id,
        utr_no: inputUTRnumber,
        status: 'approved',
        user_id: row_data.user_id,
        is_proccessed: true,
      };
      const { data: transaction_request_data, error: transaction_request_error } =
        await updateTransactionRequestDataApi(transactionRequestOjbect);
      if (transaction_request_error) {
        console.log('Error while inserting data in transaction request');
      } else if (transaction_request_data) {
        dispatch(removeFromWithdrawalNotification(row_data.id))
        dispatch(setIsModalOpen(false))
        setIsLoading(false);
        ShowToaster(TOAST_TYPE.SUCCESS, 'Data is inserted in Transaction request ');
      }
      setOpenProcessModal(false);
    } else {
      ShowToaster(TOAST_TYPE.ERROR, 'Enter UTR number');
    }
  };

  // console.log(fetchedBankData, 'fetchedBankData');

  return (
    <div className="w-full h-full z-50 flex font-poppins justify-center items-center bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
      <div className="p-10 bg-secondary border-0 rounded-lg w-[700px]">
        <div className="flex items-center justify-end border-tertiary-t4">
          <MdOutlineCancel
            onClick={() => setOpenProcessModal(false)}
            className="text-xl cursor-pointer text-primary hover:text-rose-600"
          />
        </div>
        {isDataLoading ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : (
          <div>
            {' '}
            <div className="flex gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-gray-600">Current Balance:</p>
                  <p className="text-lg text-gray-500">{fetchedWalletData?.balance} </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-gray-600">Withdrawal Amount:</p>
                  <p className="text-lg text-gray-500">{row_data.amount} </p>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-black">Transfer Preference:</h1>

                {row_data.transfer_preference == 'bank' ? (
                  <>
                    {' '}
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-gray-600">Account Holder:</p>
                      <p className="text-base text-gray-500">{fetchedBankData?.full_name} </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-gray-600">Account Number:</p>
                      <p className="text-base text-gray-500">{fetchedBankData?.account_number} </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-gray-600">IFSC Code:</p>
                      <p className="text-base text-gray-500">{fetchedBankData?.ifsc} </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-gray-600">Bank Name:</p>
                      <p className="text-base text-gray-500">{fetchedBankData?.bank_name} </p>
                    </div>
                  </>
                ) : (
                  <>
                    {' '}
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-gray-600">UPI ID:</p>
                      <p className="text-base text-gray-500">{fetchedBankData?.upi_id} </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="my-5">
              <input
                type="text"
                value={inputUTRnumber}
                onChange={(e) => setInputUTRnumber(e.target.value)}
                placeholder="Enter UTR no."
                className="w-full px-4 py-1 text-base bg-gray-100 border-2 border-gray-300 rounded-md outline-none"
              />
              {!isInputFieldEmpty ? (
                <small className="text-xs font-semibold text-rose-600">Required !!!</small>
              ) : null}
            </div>
            <div className="flex items-center justify-center gap-5 mt-5">
              <button
                onClick={() => setOpenDeleteModal(true)}
                className="text-sm border-2 border-gray-500 rounded-md px-8 py-1.5 text-black"
              >
                Delete Request
              </button>
              <button
                onClick={handleProcessData}
                disabled={isLoading}
                className="rounded-md flex justify-center items-center gap-3 border-2 border-primary py-1.5 px-8 text-center text-sm font-medium text-secondary cursor-pointer bg-primary"
              >
                {isLoading ? 'Please wait..' : 'Proceed'}
                {isLoading && <BasicSpinner />}
              </button>
            </div>
          </div>
        )}
        {openDeleteModal ? (
          <WithdrawalDeleteModal id={row_data.id} setOpenDeleteModal={setOpenDeleteModal} />
        ) : null}
      </div>
    </div>
  );
}

export default ProcessModal;
