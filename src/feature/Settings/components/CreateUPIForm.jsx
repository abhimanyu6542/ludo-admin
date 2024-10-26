/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { updateSettingApi } from '../api/settingApi';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';

const CreateUPIForm = ({ upi_1, upi_2, upi_3, upi_4 }) => {
  const [isLoading, setIsLoading] = useState(false);
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      upi_id_1: upi_1 ? upi_1 : '',
      upi_id_2: upi_2 ? upi_2 : '',
      upi_id_3: upi_3 ? upi_3 : '',
      upi_id_4: upi_4 ? upi_4 : '',
    },
  });

  const handleOnSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        upi_id_1: data.upi_id_1,
        upi_id_2: data.upi_id_2,
        upi_id_3: data.upi_id_3,
        upi_id_4: data.upi_id_4,
      };
      const settingUpdate = await updateSettingApi(payload);
      if (settingUpdate === false) {
        ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
        setIsLoading(false);
        return;
      }
      ShowToaster(TOAST_TYPE.SUCCESS, 'UPI Id saved');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
    }
  };
  return (
    <div>
      <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="flex justify-between items-center gap-5 mr-6 text-2xl font-medium font-poppins">
          <div className="flex flex-col mb-10">
            <div>
              <div className="flex flex-col text-[#4B5563] font-poppins font-normal text-xl mb-1">
                UPI ID 1
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  className="w-full px-4 rounded-md border-2 border-tertiary-t4 py-1 h-10 text-base text-[#065F46] outline-none focus:border-primary"
                  id="upi_id_1"
                  name="upi_id_1"
                  {...register('upi_id_1')}
                />

                {errors.upi_id_1?.type === 'required' && (
                  <small className="text-xs font-semibold text-red-500 ">UPI ID Required</small>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col text-[#4B5563] font-poppins font-normal text-xl mt-4 mb-1">
                UPI ID 2
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  className="w-full px-4 rounded-md border-2 border-tertiary-t4 py-1 h-10 text-base text-[#065F46] outline-none focus:border-primary"
                  id="upi_id_2"
                  name="upi_id_2"
                  {...register('upi_id_2')}
                />

                {errors.upi_id_2?.type === 'required' && (
                  <small className="text-xs font-semibold text-red-500 ">UPI ID Required</small>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-10">
            <div>
              <div className="flex flex-col text-[#4B5563] font-poppins font-normal text-xl mb-1">
                UPI ID 3
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  className="w-full px-4 rounded-md border-2 border-tertiary-t4 py-1 h-10 text-base text-[#065F46] outline-none focus:border-primary"
                  id="upi_id_3"
                  name="upi_id_3"
                  {...register('upi_id_3')}
                />

                {errors.upi_id_3?.type === 'required' && (
                  <small className="text-xs font-semibold text-red-500 ">UPI ID Required</small>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col text-[#4B5563] font-poppins font-normal text-xl mt-4 mb-1">
                UPI ID 4
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  className="w-full px-4 rounded-md border-2 border-tertiary-t4 py-1 h-10 text-base text-[#065F46] outline-none focus:border-primary"
                  id="upi_id_4"
                  name="upi_id_4"
                  {...register('upi_id_4')}
                />

                {errors.upi_id_4?.type === 'required' && (
                  <small className="text-xs font-semibold text-red-500 ">UPI ID Required</small>
                )}
              </div>
            </div>
          </div>

          <div className="flex ml-5 flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className={
                isLoading
                  ? 'px-7 cursor-wait py-1 h-10 border-2 text-sm font-bold flex justify-start items-center bg-[#065F46] text-[#FFFFFF] text-center rounded-lg'
                  : 'px-7 py-1 h-10 border-2 text-sm font-bold flex justify-start items-center bg-[#065F46] text-[#FFFFFF] text-center rounded-lg'
              }
            >
              {isLoading ? `Please wait..` : `Save`}
              {isLoading && <BasicSpinner className="ml-4 justify-items-end text-zinc-100" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUPIForm;