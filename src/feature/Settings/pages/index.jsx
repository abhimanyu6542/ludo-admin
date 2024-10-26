import React, { useEffect, useState } from 'react';
import CreateUPIForm from '../components/CreateUPIForm';
import CreateRefferalForm from '../components/CreateRefferalForm';
import {
  deleteBroadcastMsg,
  fetchSettingApi,
  getBroadcastMsg,
  setBroadcastMsg,
} from '../api/settingApi';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { useForm } from 'react-hook-form';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GameCommissionForm from '../components/GameCommissionForm';

const authSesionState = (state) => state.auth.user;
const SettingPage = () => {
  const navigate = useNavigate();
  const user = useSelector(authSesionState);

  const claims_admin = user?.app_metadata?.claims_admin || false;
  useEffect(() => {
    if (claims_admin === false) {
      navigate('/users');
    }
  }, [claims_admin]);

  const [commission, setCommission] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isToggled, setIsToggled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      message: '',
    },
  });
  const handleToggle = async () => {
    setIsToggled(!isToggled);
    if (isToggled) {
      console.log(isToggled);
      try {
        const res = await deleteBroadcastMsg();
        if (res.error) {
          throw new Error('Something went wrong');
        }
        ShowToaster(TOAST_TYPE.SUCCESS, 'Broadcast message turned off');
      } catch (e) {
        ShowToaster(TOAST_TYPE.ERROR, 'Unable to turned off broadcast message');
      }
    }
  };
  useEffect(() => {
    async function fetchData() {
      let setting = await fetchSettingApi();
      let broadcastMsg = await getBroadcastMsg();
      console.log('broadcast msg', broadcastMsg);
      if (broadcastMsg.data && broadcastMsg.data.length > 0) {
        setIsToggled(true);
        setValue('message', broadcastMsg.data[0].message);
      }
      setCommission(setting);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleOnSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const payload = {
        message: formData.message,
      };
      const { error } = await setBroadcastMsg(payload.message);
      if (error) {
        throw new Error('Something went wrong!');
      }
      ShowToaster(TOAST_TYPE.SUCCESS, 'Broadcast message saved');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
    }
  };
  return (
    <div className="pb-10">
      <div className="w-full px-2 py-3 mb-2 border-0 rounded-md bg-secondary lg:px-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-medium font-poppins">Settings</h1>
        </div>
        <div className="w-full my-3 border"></div>

        {isLoading ? (
          <div className="flex justify-center mt-16">
            <BasicSpinner />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start h-32 mt-4 gap-36">
              <div className="flex flex-col gap-6">
                <div className="grid items-center justify-start gap-6">
                  <h1 className="text-[#4B5563] font-poppins font-normal text-xl">
                    Set referral bonus
                  </h1>
                </div>
                <div className="flex justify-between gap-3 mr-6 text-2xl font-medium font-poppins">
                  <CreateRefferalForm
                    commission={
                      commission?.referral_commission ? commission?.referral_commission : ''
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid items-center justify-start gap-6">
                  <h1 className="text-[#4B5563] font-poppins font-normal text-xl">
                    Current referral bonus
                  </h1>
                </div>
                <div className="flex justify-center text-center text-[#EF4444] font-medium text-2xl font-poppins gap-3 mr-6">
                  {commission?.referral_commission ? commission?.referral_commission : 0} %
                </div>
              </div>
            </div>
            <div className="w-full my-1 border"></div>
            <div className="flex flex-wrap items-start h-32 mt-4 gap-36">
              <div className="flex flex-col gap-6">
                <div className="grid items-center justify-start gap-6">
                  <h1 className="text-[#4B5563] font-poppins font-normal text-xl">
                    Set Game Commission
                  </h1>
                </div>
                <div className="flex justify-between gap-3 mr-6 text-2xl font-medium font-poppins">
                  <GameCommissionForm
                    commission={
                      commission?.game_commission ? commission?.game_commission : ''
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid items-center justify-start gap-6">
                  <h1 className="text-[#4B5563] font-poppins font-normal text-xl">
                    Current Game Commission
                  </h1>
                </div>
                <div className="flex justify-center text-center text-[#EF4444] font-medium text-2xl font-poppins gap-3 mr-6">
                  {commission?.game_commission ? commission?.game_commission : 0} %
                </div>
              </div>
            </div>
            <div className="w-full my-1 border"></div>
            <div className="flex flex-wrap items-start h-48 gap-10 mt-8">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between gap-3 mr-6 text-2xl font-medium font-poppins">
                  <CreateUPIForm
                    upi_1={commission?.upi_id_1 ? commission?.upi_id_1 : ''}
                    upi_2={commission?.upi_id_2 ? commission?.upi_id_2 : ''}
                    upi_3={commission?.upi_id_3 ? commission?.upi_id_3 : ''}
                    upi_4={commission?.upi_id_4 ? commission?.upi_id_4 : ''}
                  />
                </div>
              </div>
            </div>
            <div className="w-full border"></div>

            <div className="flex flex-wrap items-start h-10 gap-10 mt-4">
              <div className="flex items-center justify-start gap-6 ">
                <h1 className="text-[#4B5563] font-poppins font-normal text-xl">
                  Set Broadcast Message
                </h1>
                <button
                  onClick={handleToggle}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
                    isToggled ? 'bg-[#065F46]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`transform transition ease-in-out duration-200 ${
                      isToggled ? 'translate-x-5' : 'translate-x-1'
                    } inline-block w-4 h-4 rounded-full bg-white`}
                  />
                </button>
              </div>
            </div>
            {isToggled ? (
              <div>
                <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
                  <div className="flex justify-start gap-5 mr-6 text-2xl font-medium font-poppins">
                    <div className="flex flex-col gap-3">
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        cols="50"
                        className="px-4 rounded-md border-2 border-tertiary-t4 py-1 h-20 w-full text-base text-[#065F46] focus:border-primary"
                        {...register('message', { required: true })}
                      />
                      {errors.message?.type === 'required' && (
                        <small className="text-xs font-semibold text-red-500">
                          Message Required
                        </small>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
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
                        {isLoading && (
                          <BasicSpinner className="ml-4 justify-items-end text-zinc-100" />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default SettingPage;
