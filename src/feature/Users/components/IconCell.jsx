/* eslint-disable react/prop-types */
import React from 'react';
import { GoDotFill } from 'react-icons/go';

const IconCell = ({ value }) => {
  const isKycConfirmed = value.some(item => item.kyc_status === "confirmed");
  return (
    <div>
      {
        (isKycConfirmed)
          ? <div className="flex items-center justify-start gap-2">
            <GoDotFill className="w-4 h-4 text-green-500 " />
            <div className="text-sm font-medium text-black font-poppins">Done</div>
          </div>
          : <div className="flex items-center justify-start gap-2">
          <GoDotFill className="w-4 h-4 text-red-500 " />
          <div className="text-sm font-medium text-black font-poppins">Not Done</div>
        </div>
      }


    </div>
  );
};

export default IconCell;
