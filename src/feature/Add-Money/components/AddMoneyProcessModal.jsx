/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  fetchWalletDataApi
} from '../api/walletApi';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { removeFromAddMoneyNotification } from '../../../slice/addMoney.slice';
import { setIsModalOpen } from '../../../slice/battle.slice';

const authSesionState = (state) => state.auth.session;
function AddMoneyProcessModal({ row_data, setOpenProcessModal }) {
  const { access_token } = useSelector(authSesionState);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [fetchedWalletData, setFetchedWalletData] = useState();
  const [inputUTRnumber, setInputUTRnumber] = useState();
  const [isInputFieldError, setIsInputFieldError] = useState('');

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
        setIsDataLoading(false)
      }
    };
    handleFetchWalletBalance();
  }, []);

  const handleProcessData = async () => {
    setIsInputFieldError('');
    if (!inputUTRnumber) {
      setIsInputFieldError('UTR No is Required');
      return;
    }
    if (inputUTRnumber != row_data.utr_no) {
      setIsInputFieldError("UTR No doesn't match");
      return;
    }
    setIsLoading(true);

    // -- checking if utr is already preseing in transaction_request (table);
    const url = 'https://070lnqnmoi.execute-api.ap-south-1.amazonaws.com/api/v1/add-utr-request';
    const data = {
      utr_number: row_data.utr_no,
      amount: row_data.amount,
      jwt_token: access_token,
    };

    axios
      .post(url, data)
      .then((response) => {
        console.log('Response data:', response.data);
        if (response.data.response === true) {
          // queryClient.refetchQueries({ queryKey: [UTR_QUERY_KEY] });
          ShowToaster(TOAST_TYPE.SUCCESS, 'Recharge Successfull');
          setOpenProcessModal(false)
          dispatch(removeFromAddMoneyNotification(row_data.id))
          dispatch(setIsModalOpen(false))
          location.reload(true);
        } else if (response.data.response === false) {
          ShowToaster(TOAST_TYPE.ERROR, 'Error while matching Data');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle error
        console.error('There was an error!', error);
        setIsLoading(false);
        ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
      });
  };

  return (
    <div className="w-full h-full z-50 flex font-poppins justify-center items-center bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
      <div className="p-10 bg-secondary border-0 rounded-lg w-[700px]">
        {
          isDataLoading ?   <div className="flex items-center justify-center w-full my-20">
          {' '}
          <BasicSpinner />{' '}
      </div> : <div>
      <div className="flex gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold text-gray-600">Current Balance:</p>
              <p className="text-lg text-gray-500">{fetchedWalletData?.balance} </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold text-gray-600">Recharge Amount:</p>
              <p className="text-lg text-gray-500">{row_data.amount} </p>
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

        <div className="my-5">
          <input
            type="text"
            value={inputUTRnumber}
            onChange={(e) => setInputUTRnumber(e.target.value)}
            placeholder="Confirm UTR No."
            className="w-full px-4 py-1 text-base bg-gray-100 border-2 border-gray-300 rounded-md outline-none"
          />
          {isInputFieldError ? (
            <small className="text-xs font-semibold text-rose-600">{isInputFieldError}</small>
          ) : null}
        </div>

        <div className="flex items-center justify-center gap-5 mt-5">
          <button
            onClick={() => setOpenProcessModal(false)}
            className="text-sm border-2 border-gray-500 rounded-md px-8 py-1.5 text-black"
          >
            Close
          </button>
          <button
          disabled={isLoading}
            onClick={handleProcessData}
            className="rounded-md flex justify-center items-center gap-3 border-2 border-primary py-1.5 px-8 text-center text-sm font-medium text-secondary cursor-pointer bg-primary"
          >
           {
            isLoading ? "Please wait..": "Proceed"
           }
           {
            isLoading && <BasicSpinner />
           }
          </button>
        </div>
      </div>
        }
      
      </div>
    </div>
  );
}

export default AddMoneyProcessModal;
