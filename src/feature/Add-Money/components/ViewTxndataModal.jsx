/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import CheckMark from '/assets/check-mark.png';
import { fetchWalletDataApi } from '../api/walletApi';
import { useSelector } from 'react-redux';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import WithdrawalDeleteModal from '../../withdrawl/components/WithdrawalDeleteModal';

function ViewTxndataModal({ row_data, setOpenProcessModal, isAddMoney }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedWalletData, setFetchedWalletData] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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
        setIsLoading(false);
      }
    };
    handleFetchWalletBalance();
  }, []);

  return (
    <div className="w-full h-full z-50 flex font-poppins justify-center items-center bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
      <div className="p-10 bg-secondary border-0 rounded-lg w-[700px]">
        {isLoading ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : (
          <div>
            <div className="flex gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-gray-600">Current Balance:</p>
                  <p className="text-lg text-gray-500">{fetchedWalletData?.balance} </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-gray-600">
                    {isAddMoney ? 'Recharge Amount:' : 'Withdrawal Amount'}
                  </p>
                  <p className="text-lg text-gray-500">{row_data.amount} </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-gray-600">Transaction status:</p>
                  <p
                    className={`text-sm text-green-600 capitalize flex gap-2 font-medium font-poppins`}
                  >
                    {' '}
                    {row_data.status} <img src={CheckMark} alt="CheckMark" className="w-4 h-4" />
                  </p>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-black">Transfer Preference:</h1>{' '}
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold text-gray-600">UTR NO:</p>
                  <p className="text-base text-gray-500"> {row_data.utr_no}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 mt-5">
              <button
                onClick={() => setOpenProcessModal(false)}
                className="text-sm border-2 border-gray-500 rounded-md px-8 py-1.5 text-black"
              >
                Close
              </button>
              <button
                onClick={() => setOpenDeleteModal(true)}
                className="text-sm border-2 border-gray-500 rounded-md px-8 py-1.5 text-black"
              >
                Delete Request
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

export default ViewTxndataModal;
