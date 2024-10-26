/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import AddMoneyProcessModal from './AddMoneyProcessModal';
import ViewTxndataModal from './ViewTxndataModal';

function AddMoneyEditCell({ data }) {
//   console.log(data);
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  return (
    <div>
      {data.status === 'approved' ? (
        <button
        onClick={() => setOpenViewModal(true)}
          className="text-sm border-2 border-gray-500 rounded-md w-20 py-1.5 text-black font-medium font-poppins"
        >
          View
        </button>
      ) : (
        <button
          onClick={() => setOpenProcessModal(true)}
           className="text-sm border-2 border-gray-500 rounded-md w-20 py-1.5 text-black font-medium font-poppins"
        >
          Process
        </button>
      )}

      {/* -- displaying process modal */}
      {openProcessModal ? (
        <AddMoneyProcessModal row_data={data} setOpenProcessModal={setOpenProcessModal} />
      ) : null}
      {openViewModal ? (
        <ViewTxndataModal row_data={data} setOpenProcessModal={setOpenViewModal} />
      ) : null}
    </div>
  );
}

export default AddMoneyEditCell;
