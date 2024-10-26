import React, { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import DisputedActionModal from './DisputedActionModal';

const DisputedEditCell = ({ row }) => {
  const [viewActionModal, setviewActionModal] = useState(false);

  const handleBack = async ()=>{
    setviewActionModal(false)
  }

  return (
    <>
      <div className="flex items-center justify-start">
        <button
          onClick={() => setviewActionModal(true)}
          className="rounded-full mx-2 border-0 p-1.5 text-orange-600 hover:bg-secondary"
        >
          <AiOutlineEye />
        </button>
      </div>
      {viewActionModal ? <DisputedActionModal clickEvent={handleBack } data={row.original} /> : null}
    </>
  );
};

export default DisputedEditCell;
