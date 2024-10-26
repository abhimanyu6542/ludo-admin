/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { upsertBankDetailsApi } from '../api/bankApi';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';

function BankDetailsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const user_info = useSelector((state) => state.user);
// console.log(user_info)
  const  bank_details  = user_info?.bank_details || null;
  const account_number = bank_details?.account_number || null
  const upi_id = bank_details?.upi_id || null
  const bank_name = bank_details?.bank_name || null
  const ifsc = bank_details?.ifsc || null
  const full_name = bank_details?.full_name || null



  const validationSchema = z.object({
    account_number: z
      .string()
      .min(8, "Account number must be between 8 to 18 digits")
      .max(18, "Account number must be between 8 to 18 digits"),
    ifsc_code: z.string().min(1, "required !!!"),
    bank_name: z.string().min(1, "required !!!"),
    account_name: z.string().min(1, "required !!!"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      account_number: account_number || "",
      ifsc_code: ifsc || "",
      bank_name: bank_name || "",
      account_name: full_name || "",
    },
  });

  const onSubmit = handleSubmit(async (form_data) => {
    setIsLoading(true);
    console.log("form_data -> ", form_data);
    const submitData = {
      account_number: Number(form_data.account_number),
      ifsc: form_data.ifsc_code,
      bank_name: form_data.bank_name,
      full_name: form_data.account_name,
      user_id: user_info.user_number,
    };

    await upsertBankDetailsApi(submitData);
    // dispatch(changeAccountNumber(form_data.account_number));
    // dispatch(changeIfscCode(form_data.ifsc_code));
    // dispatch(changeBankName(form_data.bank_name));
    // dispatch(changeAccountName(form_data.account_name));
    // setIsFormSubmitted(false);
    setIsLoading(false);
  });
  return (
    <>
      
      <div>
      <form onSubmit={onSubmit}>
        <p className="py-2">Bank Account Details</p>
        <div className="mb-4">
          <Controller
            name="account_number"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                minLength={8}
                maxLength={18}
                placeholder="Bank Account Number"
                onChange={(e) => field.onChange(e.target.value)}
                className="flex items-center justify-center w-full px-5 border-2 border-gray-300 rounded-lg h-8"
              />
            )}
          />
          {errors.account_number && (
            <p className="my-2 text-xs text-red-500">
              {errors.account_number.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <Controller
            name="ifsc_code"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                maxLength={11}
                minLength={11}
                placeholder="IFSC Code"
                onChange={(e) => {
                  field.onChange(e.target.value.toUpperCase());
                }}
                className="flex items-center justify-center w-full px-5 border-2 border-gray-300 rounded-lg h-8"
              />
            )}
          />
          {errors.ifsc_code && (
            <p className="my-2 text-xs text-red-500">
              {errors.ifsc_code.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <Controller
            name="bank_name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="string"
                placeholder="Bank Name"
                className="flex items-center justify-center w-full px-5 border-2 border-gray-300 rounded-lg h-8"
              />
            )}
          />
          {errors.bank_name && (
            <p className="my-2 text-xs text-red-500">
              {errors.bank_name.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <Controller
            name="account_name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Account Name"
                className="flex items-center justify-center w-full px-5 border-2 border-gray-300 rounded-lg h-8"
              />
            )}
          />
          {errors.account_name && (
            <p className="my-2 text-xs text-red-500">
              {errors.account_name.message}
            </p>
          )}
        </div>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="w-[260px] h-[36px] border-0 rounded-full flex items-center justify-center gap-3 bg-green-800 text-[16px] font-medium text-white"
          >
            Update
            {isLoading ? <BasicSpinner /> : null}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default BankDetailsForm;