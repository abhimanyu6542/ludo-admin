import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { queryClient } from '../../../config/react-query';
import { UTR_QUERY_KEY } from '../constants/utrQuerKey';
import { deleteUTRDataApi } from '../api/utrApi';

function UTRDeletModal({ setShowDeleteModal, data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);

  const handledelete = async () => {
    setShowSpinner(true);
    const deleteRes = await deleteUTRDataApi(data)
    if(deleteRes.error){
      alert('Something went wrong')
    }
    await queryClient.refetchQueries({
      queryKey: [UTR_QUERY_KEY],
    });
    setShowSpinner(false);
  };

  return (
    <>
      <div className="w-full h-full z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
        <div className="p-10 bg-secondary border-0 rounded-lg">
          <h1 className=" text-tertiary-t6 text-xl mb-10">Are you sure you want to delete ?</h1>

          <div className="flex justify-center w-full">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="mr-4 bg-transparent px-8 rounded-md border-2 border-tertiary-t4 py-1.5 text-center text-sm font-medium text-tertiary-t5 hover:bg-primary hover:text-secondary hover:border-primary cursor-pointer"
            >
              No
            </button>
            <button
              onClick={handledelete}
              className="rounded-md flex justify-center items-center gap-3 border-2 border-primary py-1.5 px-8 text-center text-sm font-medium text-secondary cursor-pointer bg-primary"
            >
              {showSpinner ? (
                <div className="">
                  <BasicSpinner />
                </div>
              ) : (
                'Yes'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UTRDeletModal;
