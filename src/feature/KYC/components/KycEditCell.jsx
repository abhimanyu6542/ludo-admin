import React, { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import KYCMODAL from './KYCModal';

const KycEditCell = ({ row }) => {
  const [viewkycmodal, setviewkycmodal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-start">
        <button
          onClick={() => setviewkycmodal(true)}
          className="rounded-full mx-2 border-0 p-1.5 text-orange-600 hover:bg-secondary"
        >
          <AiOutlineEye />
        </button>
      </div>
      {viewkycmodal ? <KYCMODAL clickEvent={() => setviewkycmodal(false)} name={row.original.users.user_name} data={row.original} /> : null}
    </>
  );
};

export default KycEditCell;
