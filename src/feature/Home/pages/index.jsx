import React, { useEffect, useMemo, useState } from 'react';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { getCurrentDate } from '../../../utils/Search/getCuurentDate';
import { useGetTotalWithdrawalQuery, useGetTotalRechargeQuery } from '../hooks/useGetTotalQuery';
import { useGetTotalCommissionQuery } from '../hooks/useGetTotalQuery';
import { useGetTotalBattleQuery } from '../hooks/useGetTotalQuery';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Function to get the date two days ago
const getTwoDaysAgoDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 2);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};
// Function to get the current date
const getCurrentDateInput = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

const authSesionState = (state) => state.auth.user;
const HomePage = () => {
  const navigate = useNavigate();
  const user = useSelector(authSesionState);
  // console.log(user, 'user');
  const claims_admin = user?.app_metadata?.claims_admin || false
  console.log(claims_admin, 'claims_admin');

  useEffect(() => {
    if (claims_admin === false) {
      navigate('/users');
    }
  }, [claims_admin]);
  const [startDate, setStartDate] = useState(getTwoDaysAgoDate());
  const [endDate, setEndDate] = useState(getCurrentDateInput());

  const [startDate1, setStartDate1] = useState(getTwoDaysAgoDate());
  const [endDate1, setEndDate1] = useState(getCurrentDateInput());
  const filters = useMemo(() => {
    return {
      startDate: startDate,
      endDate: endDate,
    };
  }, [endDate, startDate]);

  const search = () => {
    setStartDate(startDate1);
    endDate(endDate1);
  };
  const withdrawalData = useGetTotalWithdrawalQuery(filters);
  const rechargeData = useGetTotalRechargeQuery(filters);
  const commissionData = useGetTotalCommissionQuery(filters);
  const gameData = useGetTotalBattleQuery(filters);
  return (
    <div>
      <div className="pb-10">
        <div className="w-full px-2 py-3 mb-2 border-0 rounded-md bg-secondary lg:px-6">
          <div className="flex justify-between">
            <h1 className=" font-medium text-[3vw] text-[#065F46] font-poppins">Welcome</h1>
            <p className=" font-medium text-[1.5vw] text-[#065F46] font-poppins">{getCurrentDate()}</p>
          </div>
          <div className="w-full border my-[2vw] "></div>

          {withdrawalData.isLoading ? (
            <div className="flex justify-center mt-[10vw] ">
              <BasicSpinner />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-[1vw] ">
                <p className="text-[1.2vw] font-medium text-center font-poppins">From</p>
                <input
                  value={startDate1}
                  type="date"
                  placeholder={getCurrentDate()}
                  onChange={(e) => setStartDate1(e.target.value)}
                  className="flex items-center justify-center text-[1.1vw] px-5 border-2 border-gray-300 rounded-lg w-[14vw] h-[2.5vw] "
                />
                <p className="text-[1.2vw] font-medium text-center font-poppins">To</p>
                <input
                  value={endDate1}
                  type="date"
                  placeholder={getCurrentDate()}
                  max={getCurrentDateInput()}
                  onChange={(e) => setEndDate1(e.target.value)}
                  className="flex items-center justify-center text-[1.1vw] w-[14vw] px-5 border-2 border-gray-300 rounded-lg h-[2.5vw] "
                />
                <button onClick={search} className="px-[1.5vw] py-[0.2vw] text-white bg-gray-500 font-poppins">
                  Search
                </button>
              </div>

              <div className="w-full border my-[2vw] "></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vw] md:gap-[4vw] ">
                <div className="flex flex-col">
                  <h1 className="text-[2vw] font-medium text-gray-700 font-poppins">Total Recharge Amount</h1>
                  <h1 className="text-[1.2vw] font-medium text-pink-700 font-poppins">{rechargeData?.data}</h1>
                </div>

                <div className="flex flex-col">
                  <h1 className="text-[2vw] font-medium text-gray-700 font-poppins">Total Withdrawal Amount </h1>
                  <h1 className="text-[1.2vw] font-medium text-pink-700 font-poppins">{withdrawalData?.data} </h1>
                </div>

                <div className="flex flex-col">
                  <h1 className="text-[2vw] font-medium text-gray-700 font-poppins">Total Commission </h1>
                  <h1 className="text-[1.2vw] font-medium text-pink-700 font-poppins">{commissionData?.data} </h1>
                </div>

                <div className="flex flex-col">
                  <h1 className="text-[2vw] font-medium text-gray-700 font-poppins">No. of Games Played </h1>
                  <h1 className="text-[1.2vw] font-medium text-pink-700 font-poppins">{gameData?.data} </h1>
                </div>
              </div>


            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
