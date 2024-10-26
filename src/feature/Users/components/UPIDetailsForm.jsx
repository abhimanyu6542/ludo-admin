/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { upsertBankDetailsApi } from '../api/bankApi';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';

function UPIDetailsForm({clickEvent}) {
  const [isLoading, setIsLoading] = useState(false);
  const user_info = useSelector((state) => state.user);
// console.log(user_info)
  const  bank_details  = user_info?.bank_details || null;
  const upi_id = bank_details?.upi_id || null



  const validationSchema = z.object({
    upi_id: z.string().min(1, "required !!!"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
        upi_id: upi_id || "",
    },
  });

  const onSubmit = handleSubmit(async (form_data) => {
    setIsLoading(true);
    // setIsFormSubmitted(true);
    console.log("form_data -> ", form_data);
    const submitData = {
      upi_id: form_data.upi_id,
      user_id: user_info.user_number,
    };

    await upsertBankDetailsApi(submitData);
    // dispatch(changeUpiId(form_data.upi_id));
    setIsLoading(false);
  });

  return (
    <>
      
      <div>
      <form onSubmit={onSubmit}>
        <p className="py-2">UPI Details</p>
        <div className="mb-4">
          <Controller
            name="upi_id"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Add you UPI ID"
                className="flex items-center justify-center w-full px-5 border-2 border-gray-300 rounded-lg h-8"
              />
            )}
          />
          {errors.upi_id && (
            <p className="my-2 text-xs text-red-500">{errors.upi_id.message}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-4 justify-center w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="w-[260px] h-[36px] border-0 rounded-full flex items-center justify-center gap-3 bg-green-800 text-[16px] font-medium text-white"
          >
            Update
            {isLoading ? <BasicSpinner /> : null}
          </button>
          <div
            
          onClick={clickEvent}
            className="w-[260px] h-[36px] border-2 border-black cursor-pointer rounded-full flex items-center justify-center gap-3 bg-white text-[16px] font-medium text-black"
          >
            Cancel
          </div>
        </div>
      </form>
    </div>
    </>
  );
}

export default UPIDetailsForm;