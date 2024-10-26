/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  setTotalBattles,
  setWinBattles,
  setLossBattles, setUserName, setUserNumber, setUniqueCode, setReferralCode, setFullName, setIsBanned, setUserInfo, setWalletData, setBankDetails } from '../../../slice/userSlice';


const EditCell = ({ row }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const handleUserView = () => {
    dispatch(setBankDetails(row.original.bank_details));
    dispatch(setUserName(row.original.user_name));
    dispatch(setUserNumber(row.original.phone));
    dispatch(setUniqueCode(row.original.unique_code));
    dispatch(setReferralCode(row.original.referral_code));
    dispatch(setFullName(row.original.full_name));
    dispatch(setIsBanned(row.original.is_banned));
    dispatch(setUserInfo(row.original));
    dispatch(setWalletData(row.original.wallet));
    dispatch(setTotalBattles(row.original.battles));
    dispatch(setWinBattles(row.win_battles));
    dispatch(setLossBattles(row.original.loss_battles));
    navigate(`/users/${row.original.phone}`)
  };

  return (
    <>
      <div className="flex items-center justify-start">
        <button
          onClick={handleUserView}
          className="rounded-full mx-2 border-0 p-1.5 text-orange-600 hover:bg-secondary"
        >
          <AiOutlineEye />
        </button>
      </div>
    </>
  );
};

export default EditCell;
