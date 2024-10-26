import React, { useEffect, useState } from 'react';
import { fetchUserDataApi } from '../../Users/api/userApi';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { HiOutlinePlusSmall } from 'react-icons/hi2';
import { queryClient } from '../../../config/react-query';
import { GET_ALL_BATTLE_QUERY_KEY } from '../../Users/constants/userQueryKey';
import { useNavigate } from 'react-router-dom';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import { useDispatch, useSelector } from 'react-redux';
import { setManagedUser } from '../../../slice/userSlice';
import axios from 'axios';

const CreateGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const access_token = useSelector((state) => state.auth.session.access_token);

  const [user, setUser] = useState();
  const [entryFee, setEntryFee] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getManageUser() {
      let response = await fetchUserDataApi();
      // console.log('Fetched Data:', response.data); // Check the structure

      // Ensure data.data exists and is an array
      if (Array.isArray(response.data)) {
        const manageTrue = response.data.filter((item) => item.is_managed === true);

        dispatch(setManagedUser(manageTrue));
      }
    }
    getManageUser();
  }, []);

  const managedUser = useSelector((state) => state.user.managed_user) || [];
  const usersNotPlaying = managedUser.filter((item) => item.is_playing === false);
  function handleDropDown(e) {
    const selectedUser = usersNotPlaying.find((item) => item.user_name === e.target.value);
    setUser(selectedUser); // Now you're setting the full user object
  }

  const createNewGame = async () => {
    if (!user) {
      ShowToaster(TOAST_TYPE.ERROR, 'User must be selected');
      return;
    }
    // Check if the value is a valid multiple of 100
    if ((entryFee % 50 !== 0 && entryFee !== 0) || entryFee === 0) {
      ShowToaster(TOAST_TYPE.ERROR, 'Amount must be a multiple of 50');

      return;
    }
    try {
      setIsLoading(true);
      const newBattleObj = {
        created_by: user.user_name,
        entry_fee: Number(entryFee),
        jwt_token: access_token,
      };
      await axios.post(
        'https://rupbhkrgwi.execute-api.ap-south-1.amazonaws.com/api/v1/game-new',
        newBattleObj
      );
      setIsLoading(false);
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_BATTLE_QUERY_KEY],
      });
      navigate('/manage-game');
      setIsLoading(false);
      ShowToaster(TOAST_TYPE.SUCCESS, 'Game Created Successfully');
    } catch (error) {
      ShowToaster(TOAST_TYPE.ERROR, error.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/manage-game');
  };
  return (
    <div>
      <div className="flex items-center justify-start w-full">
        <div
          onClick={handleBack}
          className=" flex border-2 w-fit cursor-pointer items-center p-1 px-2 rounded-md font-medium text-xl font-title text-[#1F2937]"
        >
          BACK
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex border-2 rounded-lg p-6 flex-col justify-center w-[500px] gap-3">
          <div className="flex">
            <p className="font-poppins">Set Creator : </p>
            <strong className="font-medium">
              <select
                className="w-full ml-2 px-10 py-2 text-sm border rounded-md outline-none cursor-pointer"
                id="user"
                name="user"
                value={user?.user_name || ''}
                onChange={handleDropDown}
              >
                <option value="" disabled>
                  Select a user
                </option>
                {usersNotPlaying.map((i) => (
                  <option key={i.user_name} value={i.user_name}>
                    {i.user_name}
                  </option>
                ))}
              </select>
            </strong>
          </div>

          <div className="flex">
            <p className="font-poppins ml-5">Entry Fee : </p>
            <input
              type="number"
              className="ml-2 w-44 px-5 py-2 text-sm border rounded-md outline-none"
              onChange={(e) => setEntryFee(e.target.value)}
              value={entryFee}
            />
          </div>
          <button
            onClick={createNewGame}
            className="px-3 py-2 border-2 flex justify-center  bg-[#065F46] text-[#FFFFFF] rounded-md"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                {' '}
                <p>Please wait..</p> <BasicSpinner />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {' '}
                <HiOutlinePlusSmall className="w-6 h-6 text-white" /> Create Game{' '}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
