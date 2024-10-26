/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { deleteWithdrawalDataApi } from '../api/withdrawalApi';
import { useDispatch } from 'react-redux';
import { removeFromWithdrawalData, removeFromWithdrawalNotification } from '../../../slice/withdrawal.slice';

function WithdrawalDeleteModal({ id, setOpenDeleteModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()

  const handleDeleteData = async () => {
    setIsLoading(true);
    const res = await deleteWithdrawalDataApi(id);
    if (res.status === 204) {
      let message = !res.error ? `Record has been Deleted successfully` : 'Something went Wrong';

      ShowToaster(res.error ? TOAST_TYPE.ERROR : TOAST_TYPE.SUCCESS, message);
      setIsLoading(false);
      dispatch(removeFromWithdrawalNotification(id))
      dispatch(removeFromWithdrawalData(id))
      window.location.reload();
    } else {
      let message = 'Something went Wrong';
      ShowToaster(TOAST_TYPE.ERROR, message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full z-50 flex font-poppins justify-center items-center bg-black fixed top-0 left-0">
      <div className="p-10 bg-secondary border-0 rounded-lg w-[600px]">
        <div>
          {' '}
          <div className="flex justify-center gap-4 text-[24px]">
            Are you sure to delete this record ??
          </div>
          <div className="flex items-center justify-center gap-5 mt-8">
            <button
              onClick={() => setOpenDeleteModal(false)}
              className="text-sm border-2 border-gray-500 rounded-md px-8 py-1.5 text-black"
            >
              Close
            </button>
            <button
              onClick={handleDeleteData}
              disabled={isLoading}
              className="rounded-md flex justify-center items-center gap-3 border-2 border-primary py-1.5 px-8 text-center text-sm font-medium text-secondary cursor-pointer bg-primary"
            >
              {isLoading ? 'Please wait..' : 'Delete Record'}
              {isLoading && <BasicSpinner />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalDeleteModal;
