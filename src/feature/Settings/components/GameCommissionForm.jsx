/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { updateSettingApi } from '../api/settingApi';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';

const GameCommissionForm = ({ commission }) => {
  const [isLoading, setIsLoading] = useState(false);
  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      game_commission: commission,
    },
  });

  const handleOnSubmit = async (data) => {
    console.log(data, 'form data');
    // game_commission

    try {
      setIsLoading(true);
      const payload = {
        game_commission: Number(data.game_commission),
      };
      const settingUpdate = await updateSettingApi(payload);
      if (settingUpdate === false) {
        ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
        return;
      }
      window.location.reload();
      ShowToaster(TOAST_TYPE.SUCCESS, 'Game commission saved');
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
        <div className="flex justify-between font-medium text-2xl font-poppins gap-5 mr-6">
          <div className="flex flex-col gap-3">
            <input
              type="number"
              className="w-36 text-center px-4 rounded-md border-2 border-tertiary-t4 py-1 h-10 text-base text-tertiary-t4 outline-none focus:border-primary"
              id="game_commission"
              name="game_commission"
              placeholder="Enter %"
              {...register('game_commission')}
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className={
                isLoading
                  ? 'px-5 cursor-wait py-1 h-10 border-2 text-sm font-bold flex justify-start items-center bg-[#065F46] text-[#FFFFFF] text-center rounded-lg'
                  : 'px-5 py-1 h-10 border-2 text-sm font-bold flex justify-start items-center bg-[#065F46] text-[#FFFFFF] text-center rounded-lg'
              }
            >
              {isLoading ? `Please wait..` : `Set Now`}
              {isLoading && <BasicSpinner className="ml-4 justify-items-end  text-zinc-100" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GameCommissionForm;
