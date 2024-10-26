import React, { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import NotificationOnOff from './NotificationOnOff';
import Battles from './Battles';
import Withdrawals from './Withdrawals';
import AddMoney from './AddMoney';

const NotificationModal = ({ clickEvent }) => {


  const [currentTab, setCurrentTab] = useState(1)
  const displayComponent = (num = 1) => {
    switch (num) {
      case 1:
        return < Battles/>;
      case 2:
        return <Withdrawals />;
      case 3:
        return <AddMoney />;
    }
  };
  return (
    <div>
      <div className="fixed left-0 top-0 z-50 flex h-[100vh] w-[100vw] items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="flex font-poppins flex-col rounded-md h-[550px] border-0 w-[1000px] bg-secondary px-12 py-5">
          <div className="flex items-center justify-between py-3 border-tertiary-t4">
            <h1 className="text-xl flex gap-4 font-poppins font-medium text-[#1F2937]">Notifications <span className=' ml-4'><NotificationOnOff /></span></h1>
            <MdOutlineCancel
              onClick={() => clickEvent()}
              className="text-xl cursor-pointer text-primary hover:text-rose-600"
            />
          </div>

          {/* data  */}

          <div className="flex items-center my-3 justify-evenly md:justify-normal">
          <button
            onClick={() => setCurrentTab(1)}
            className={`md:mr-7 font-normal font-poppins text-xl pb-2  ${
              currentTab === 1
                ? 'text-[#065F46] border-b-2 border-[#065F46]'
                : 'text-[#9CA3AF]'
            }`}
          >
             Battles 
          </button>
          <button
            onClick={() => setCurrentTab(2)}
            className={`md:mr-7 font-normal font-poppins text-xl pb-2  ${
              currentTab === 2
                ? 'text-[#065F46] border-b-2 border-[#065F46]'
                : 'text-[#9CA3AF]'
            }`}
          >
           Withdrawals
          </button>
          <button
            onClick={() => setCurrentTab(3)}
            className={`md:mr-7 font-normal font-poppins text-xl pb-2  ${
              currentTab === 3
                ? 'text-[#065F46] border-b-2 border-[#065F46]'
                : 'text-[#9CA3AF]'
            }`}
          >
           Add Money
          </button>
        </div>

        <div>{displayComponent(currentTab)}</div>
          {/* data  */}

          {/* form  */}
       
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
