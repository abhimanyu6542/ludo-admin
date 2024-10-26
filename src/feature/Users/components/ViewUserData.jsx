import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Profile from '/assets/profile.png';
import Battle from '/assets/battle.png';
import Edit from '/assets/edit.png';
import { HiOutlineMinusSmall, HiOutlinePlusSmall } from 'react-icons/hi2';
import { CiWallet } from 'react-icons/ci';
import { IoBan } from 'react-icons/io5';
import ReferUserTable from './ReferUser/ReferUserTable';
import ReferralHistory from './ReferralHistory/ReferralHistory';
import TransactionHistory from './TransactionHistory/TransactionHistory';
import BattleHistory from './Battle History/BattleHistory';
import { HiBadgeCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import AddBalanceModal from './AddBalanceModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUserName,
  setUserNumber,
  setUniqueCode,
  setReferralCode,
  setFullName,
  setIsBanned,
  setUserInfo,
  setWalletData,
  setBankDetails,
} from '../../../slice/userSlice';
import { supabase } from '../../../config/supabaseClient';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import SubtractBalanceModal from './SubtractBalanceModal';
import BankModal from './BankModal';

const ViewUserData = () => {
  const { id } = useParams();

  const user_info = useSelector((state) => state.user.user_info);
  const wallet_data = useSelector((state) => state.user.wallet_data);

  const { full_name, is_banned, phone, referral_code, unique_code, user_kyc_request, battles, win_battles, loss_battles } = user_info;
  const { balance, referral_earning, total_amount_recharged, total_amount_withdrawn } = wallet_data;

  // const isKycConfirmed = user_kyc_request.some((item) => item.kyc_status === 'confirmed');

  const [userBan, setUserBan] = useState(is_banned ? true : false);

  useEffect(() => {
    const subscriptions = supabase
      .channel('get-wallet-balance')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallet',
          filter: `user_id=eq.${phone}`,
        },
        (payload) => {
          dispatch(setWalletData(payload.new));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscriptions);
    };
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/users');
    dispatch(setUserName(null));
    dispatch(setUserNumber(null));
    dispatch(setUniqueCode(null));
    dispatch(setReferralCode(null));
    dispatch(setFullName(null));
    dispatch(setIsBanned(null));
    dispatch(setUserInfo(null));
    dispatch(setWalletData(null));
    dispatch(setBankDetails(null));
  };
  const [openAddBalanceModal, setOpenAddBalanceModal] = useState(false)
  const [openSubtractBalanceModal, setOpenSubtractBalanceModal] = useState(false)
  const [openBankDetailModal, setOpenBankDetailModal] = useState(false)
  const [currentTabNumber, setCurrentTabNumber] = useState(1);

  const handleUserBan = async () => {
    setUserBan(true);

    const { data, error } = await supabase
      .from('users')
      .update({ is_banned: true })
      .eq('phone', phone)
      .select();
    if (error) {
      ShowToaster(TOAST_TYPE.ERROR, error);
    }
    ShowToaster(TOAST_TYPE.SUCCESS, 'User banned successfully');
  };
  const handleUserActivate = async () => {
    setUserBan(false);

    const { data, error } = await supabase
      .from('users')
      .update({ is_banned: false })
      .eq('phone', phone)
      .select();
    if (error) {
      ShowToaster(TOAST_TYPE.ERROR, error);
    }
    ShowToaster(TOAST_TYPE.SUCCESS, 'User activated successfully');
  };

  const displayComponent = (num = 1) => {
    switch (num) {
      case 1:
        return <TransactionHistory />;
      case 2:
        return <BattleHistory />;
      case 3:
        return <ReferUserTable />;
      case 4:
        return <ReferralHistory />;
    }
  };

  const earning = Number(balance) + Number(total_amount_withdrawn) - Number(total_amount_recharged);
  // Ensure result is not negative
  const finalEarning = Math.max(earning, 0);
  return (
    <div className="top-0 px-6 py-3 mb-3 bg-white font-poppins ">
      <div className="flex items-center justify-start w-full">
        <div
          onClick={handleBack}
          className="border-2 cursor-pointer items-center px-[1vw] py-[0.2vw] rounded-md font-semibold text-[1vw]   text-[#1F2937]"
        >
          Back
        </div>
      </div>

      <div className="flex flex-wrap items-start p-3 px-4 my-5 border-2 w-fit gap-4">
        <img src={Profile} alt="Profile" className='w-[8vw] rounded-[0.5vw] ' />

        <div className="flex flex-col gap-[0.2vw] ">
          <h1 className=" text-[#1F2937]   font-semibold text-[1.5vw] ">{full_name}</h1>
          <p className="text-[#6B7280]   font-normal text-[1.2vw]">{phone}</p>
        </div>

        <div className="flex gap-[0.2vw] border-l-2 border-r-2 border-tertiary-t3 px-[1vw] ">
          <div className='flex flex-col gap-[0.5vw] items-end '>
            <div className='flex items-center col-span-3'>
              <img className="w-[1.5vw]" src={Battle} alt="" />
              <h1 className="text-[#065F46] font-normal text-[1.3vw]  ">Battles played</h1>
            </div>
            <h1 className='col-span-3 text-[#6B7280]   font-normal text-[1.3vw]'>Won</h1>
            <h1 className='col-span-3 text-[#6B7280]   font-normal text-[1.3vw]'>Lost</h1>
          </div>

          <div className="flex flex-col gap-[0.5vw] items-end">
            <p className="text-[#000] font-bold text-[1.3vw]  ">{battles}</p>
            <p className="text-[#000] font-bold text-[1.3vw]   ml-5">{win_battles}</p>{' '}
            <p className="text-[#000] font-bold text-[1.3vw]   ml-5">{loss_battles}</p>{' '}
          </div>
        </div>

        <div className="flex items-end justify-end gap-2 ">
          <div className="flex flex-col justify-between gap-14">
            <div className="flex items-start justify-end">
              {/* <button className="flex justify-start items-center gap-4 text-[#EF4444]   font-normal text-[1.3vw]"> */}
              {/* Edit <img src={Edit} alt="" />{' '} */}
              {/* </button> */}
            </div>
            <h1 className="  text-[#6B7280] font-normal text-[1.3vw]">
              Earnings{' '}
              <span className="   font-bold text-[1.3vw] text-[#000000] ">
                Rs.{finalEarning.toFixed(2)}
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-[4vw] my-[4vw]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-start gap-3">
            <CiWallet className="w-6 h-6 " />
            <h1 className="text-[#1F2937]   font-normal text-[1.3vw]">Current Balance</h1>
            <h1 className=" text-[1.3vw] font-normal text-center border-2 rounded-[0.5vw] px-[1vw]  ">
              {balance.toFixed(2)}
            </h1>
          </div>

          <div className="flex items-center justify-start gap-3">
            <CiWallet className="w-6 h-6 " />
            <h1 className="text-[#1F2937]   font-normal text-[1.3vw]">Manage Balance</h1>
            <button
              onClick={() => setOpenAddBalanceModal(true)}
            >
              <HiOutlinePlusSmall className="p-[0.1vw] flex justify-center items-center bg-[#065F46] rounded-full text-white text-[2vw]" />
            </button>
            <button
              onClick={() => setOpenSubtractBalanceModal(true)}
            >
              <HiOutlineMinusSmall className="p-[0.1vw] flex justify-center items-center bg-[#c6383d] rounded-full text-white text-[2vw]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-start gap-3">
            <h1 className="text-[#1F2937]   font-normal text-[1.3vw]">Referral Code</h1>
            <h1 className=" text-[1.3vw] font-normal text-center border-2 rounded-[0.5vw] px-[1vw]  ">
              {unique_code}
            </h1>
          </div>
          <div className="flex items-center justify-start gap-3">
            <h1 className="text-[#1F2937]   font-normal text-[1.3vw]">Referral Earnings</h1>
            <h1 className="  font-bold text-[1.3vw] text-[#000000]">{referral_earning}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-[1vw]">
          <div className="">
            {userBan ? (
              <>
                <button
                  onClick={handleUserActivate}
                  className={
                    'px-[1vw] py-[0.2vw] flex text-[1.5vw] items-center bg-[#6f44ef] text-[#FFFFFF] rounded-md'
                  }
                >
                  <div className="flex items-center gap-2">
                    <IoBan className="w-[2vw] text-white" />
                    Activate User{' '}
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUserBan}
                  className={
                    'px-[1vw] py-[0.2vw] flex text-[1.5vw] items-center bg-[#EF4444] text-[#FFFFFF] rounded-md'
                  }
                >
                  <div className="flex items-center gap-2">
                    <IoBan className="w-[2vw] text-white" />
                    Ban User
                  </div>
                </button>
              </>
            )}

          </div>

          <button onClick={() => setOpenBankDetailModal(true)} className="px-[1vw] py-[0.2vw] flex text-[1.5vw] items-center bg-[#3B82F6] text-[#FFFFFF] text-center rounded-md">Bank & UPI
          </button>
        </div>

      </div>

      <div className="w-full border"></div>
      {/* Tab  */}
      <div className="flex items-center my-5 justify-evenly md:justify-normal">
        <button
          onClick={() => setCurrentTabNumber(1)}
          className={`md:mr-7   text-[1.3vw] pb-2  ${currentTabNumber === 1
            ? 'text-[#180C2D] font-bold border-b-2 border-black'
            : 'text-[#9CA3AF]'
            }`}
        >
          Transaction History
        </button>
        <button
          onClick={() => setCurrentTabNumber(2)}
          className={`md:mr-7   text-[1.3vw] pb-2  ${currentTabNumber === 2
            ? 'text-[#180C2D] font-bold border-b-2 border-black'
            : 'text-[#9CA3AF]'
            }`}
        >
          Battle History
        </button>
        <button
          onClick={() => setCurrentTabNumber(3)}
          className={`md:mr-7   text-[1.3vw] pb-2  ${currentTabNumber === 3
            ? 'text-[#180C2D] font-bold border-b-2 border-black'
            : 'text-[#9CA3AF]'
            }`}
        >
          Referred Users
        </button>
        <button
          onClick={() => setCurrentTabNumber(4)}
          className={`md:mr-7   text-[1.3vw] pb-2  ${currentTabNumber === 4
            ? 'text-[#180C2D] font-bold border-b-2 border-black'
            : 'text-[#9CA3AF]'
            }`}
        >
          Referral History
        </button>
      </div>

      <div>{displayComponent(currentTabNumber)}</div>

      {openAddBalanceModal ? (
        <AddBalanceModal
          clickEvent={() => setOpenAddBalanceModal(false)}
          name={full_name}
          phone={phone}
          availableBalance={balance}
        />
      ) : null}

      {openSubtractBalanceModal ? (
        <SubtractBalanceModal
          clickEvent={() => setOpenSubtractBalanceModal(false)}
          name={full_name}
          phone={phone}
          availableBalance={balance}
        />
      ) : null}


      {/* {openBankDetailModal ? <BankDetailModal clickEvent={()=>setOpenBankDetailModal(false)} name={'Shomai'} />: null} */}
      {openBankDetailModal ? <BankModal clickEvent={() => setOpenBankDetailModal(false)} name={full_name} /> : null}
    </div>
  );
};

export default ViewUserData;
