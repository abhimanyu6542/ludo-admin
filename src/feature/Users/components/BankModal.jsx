import React from 'react';
import BankDetailsForm from './BankDetailsForm';
import UPIDetailsForm from './UPIDetailsForm';

const BankModal = ({ clickEvent, name }) => {
  return (
    <div>
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="flex font-poppins flex-col rounded-md border-0 w-[750px] bg-secondary px-12 py-5">
          <div className="flex items-center justify-between py-3 border-tertiary-t4">
            <h1 className="text-xl font-poppins font-medium text-[#1F2937]">
              Account Details :{' '}
              <span className="text-xl font-semibold text-center text-[#EF4444]">{name}</span>{' '}
            </h1>
          </div>

          {/* form  */}
          <div className="flex justify-center gap-6">
            <BankDetailsForm />
            <UPIDetailsForm clickEvent={clickEvent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankModal;
