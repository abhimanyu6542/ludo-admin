/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { updateKycDataApi } from '../api/kycApi';
import { queryClient } from '../../../config/react-query';
import { KYC_QUERY_KEY } from '../constants/kycQuerKey';
import { AADHAAR_FRONT_SIDE_URL, AADHAAR_BACK_SIDE_URL } from '../constants/image_url';

function KYCMODAL({ clickEvent, name, data }) {

  const [comments, setcomments] = useState(data.comments || '');

  const front_image = `${AADHAAR_FRONT_SIDE_URL}/${data.aadhaar_front}`;
  const back_image = `${AADHAAR_BACK_SIDE_URL}/${data.aadhaar_back}`;

  const handleApprovedData = async () => {
    const payload = {
      kyc_status: 'confirmed',
      id: data.id,
    };

    const res = await updateKycDataApi(payload);
    if (!res.error) {
      await queryClient.refetchQueries({
        queryKey: [KYC_QUERY_KEY],
      });
    }
  };
  const handleRejectedData = async () => {
    if (comments !== '') {
      const payload = {
        kyc_status: 'rejected',
        id: data.id,
        comments,
      };
      const res = await updateKycDataApi(payload);
      if (!res.error) {
        await queryClient.refetchQueries({
          queryKey: [KYC_QUERY_KEY],
        });
      }
    } else {
      alert('Please add some comments');
      return;
    }
  };
  return (
    <>
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="flex font-poppins flex-col rounded-md border-0 bg-secondary px-12 py-5">
          <div className="flex items-center justify-between p-3 border-tertiary-t4">
            <h1 className="text-xl font-semibold text-tertiary-t5">
              Maunal KYC Verification :{' '}
              <span className="text-xl font-semibold text-center text-[#EF4444]">{name}</span>{' '}
            </h1>
            <MdOutlineCancel
              onClick={() => clickEvent()}
              className="text-xl cursor-pointer text-primary hover:text-rose-600"
            />
          </div>
          <div className="flex gap-5">
            <div className="">
              <h1 className="mb-3 text-[#1F2937] font-medium text-lg font-poppins text-center">
                Front
              </h1>
              <img src={front_image} alt="" className=" w-80 h-56" />
            </div>
            <div className="">
              <h1 className="mb-3 text-[#1F2937] font-medium text-lg font-poppins text-center">
                Back
              </h1>
              <img src={back_image} alt="" className=" w-80 h-56" />
            </div>
          </div>
          {data.kyc_status === 'submitted' ? (
            <div className="flex items-center mt-5">
              <textarea
                rows="2"
                value={comments}
                onChange={(e) => setcomments(e.target.value)}
                cols="60"
                placeholder="Add Comments"
                className="w-full resize-none text-base border-2 rounded-md outline-none text-center py-3 border-tertiary-t4 text-tertiary-t4 focus:border-primary"
              ></textarea>
              {data.kyc_status === 'rejected' || data.kyc_status === 'confirmed' ? null : (
                <div className=" flex flex-col gap-3">
                  <button
                    onClick={handleApprovedData}
                    className=" bg-[#065F46] text-white px-3 py-1 rounded ml-5"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleRejectedData}
                    className="bg-[#9CA3AF] text-white px-3 py-1 rounded ml-5"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default KYCMODAL;
