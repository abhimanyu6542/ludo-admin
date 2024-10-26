import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../config/supabaseClient';
import { FiEyeOff, FiEye } from 'react-icons/fi';
import BasicSpinner from '../../../../components/Spinner/BasicSpinner';

import { useDispatch } from 'react-redux';
import useAppCheckUp from '../../hooks/useAppCheckUp';
import { LOCAL_STORAGE_KEYS } from '../../../../constants/common';

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);



  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (formData) => {
    event.preventDefault();
    setIsLoading(true);

    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (data.user) {
      useAppCheckUp(data, navigate, dispatch);
    }
    if (error) {
      setIsLoading(false);
      setError(error.message);
      console.log('Error => ', error);
    }
  };
  return (
    <>
      <div className="border-5 bottom-3 flex h-screen w-screen items-center justify-center">
        <div className="border-1 flex w-[400px] flex-col items-center rounded-md border border-black p-10">
          <h1 className="mb-8 text-2xl font-bold text-primary">Sign In</h1>
          {error && <div className="text-red-500">{error}</div>}
          <form className="w-full" onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-4">
              {/* ----   Email  ---- */}
              <input
                {...register('email', {
                  required: 'This feild is required *',
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: 'Please enter a valid e-mail address',
                  },
                })}
                type="email"
                placeholder="Email-id"
                className="w-full rounded-md border-2 border-tertiary-t4 px-2 py-1 text-lg text-tertiary-t4 outline-none "
              />
              {errors.email && (
                <small className="mt-0 text-xs font-semibold text-red-500">
                  {errors.email.message}{' '}
                </small>
              )}
            </div>

            {/* ----   Password  ---- */}
            <div className="mb-4">
              <div className=" flex w-full items-center justify-between rounded-md border-2 border-tertiary-t4 px-2 py-1 text-lg text-tertiary-t4">
                <input
                  {...register('password', {
                    required: 'This feild is required *',
                    pattern: {
                      value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                      message:
                        ' password requirements: (UpperCase, LowerCase, Number/SpecialChar)',
                    },
                  })}
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  className=" outline-none "
                />
                <div
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="cursor-pointer text-lg text-tertiary-t4"
                >
                  {passwordVisible ? <FiEye /> : <FiEyeOff />}
                </div>
              </div>
              {errors.password && (
                <small className="mt-0 text-xs font-semibold text-red-500">
                  {errors.password.message}{' '}
                </small>
              )}
            </div>
           

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full flex-row justify-center gap-4 rounded-md border-0 bg-primary  py-2 text-center font-semibold text-secondary hover:bg-primary"
            >
              <div className="text-sm">{isLoading ? 'Signing In' : 'Sign In'}</div>
              {isLoading && (
                <BasicSpinner className="justify-items-end leading-[12px] text-zinc-100" />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
