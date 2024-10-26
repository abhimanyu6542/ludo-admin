/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import ProcessModal from './ProcessModal';
import ViewTxndataModal from '../../Add-Money/components/ViewTxndataModal';
import WithdrawalDeleteModal from './WithdrawalDeleteModal';

function WithdrawalEditCell({ row }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  // console.log(row)
  return (
    <div className="flex gap-3 ">
      {row.status === 'approved' ? (
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
      {/* <button
        onClick={() => setOpenDeleteModal(true)}
        className="text-sm border-2 border-gray-500 rounded-md w-20 py-1.5 text-black font-medium font-poppins"
      >
        Delete
      </button> */}

      {/* -- displaying process modal */}
      {openProcessModal ? (
        <ProcessModal row_data={row} setOpenProcessModal={setOpenProcessModal} />
      ) : null}
      {openViewModal ? (
        <ViewTxndataModal
          row_data={row}
          setOpenProcessModal={setOpenViewModal}
          isAddMoney={false}
        />
      ) : null}
      {openDeleteModal ? (
        <WithdrawalDeleteModal id={row.id} setOpenDeleteModal={setOpenDeleteModal} />
      ) : null}
    </div>
  );
}

export default WithdrawalEditCell;
