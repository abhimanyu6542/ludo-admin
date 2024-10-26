/* eslint-disable react/prop-types */
import React from 'react';
import approved from '/assets/approved.png'
import { HiX } from 'react-icons/hi';

const BattleStatusCell = ({ value }) => {
  return (
    <>
      {value == 'completed' ? (
        <div className=" flex justify-start uppercase items-center gap-3 font-normal text-base text-[#4B5563] font-poppins"> <img src={approved} alt="approved" className=' w-5 h-5' /> {value} </div>
      ) : (
        <div className=" flex justify-start uppercase items-center gap-3 font-normal text-base text-[#4B5563] font-poppins"> <HiX className='text-[#EF4444] w-5 h-5' /> {value} </div>
      )}
      
      
    </>
  );
};
export default BattleStatusCell;
