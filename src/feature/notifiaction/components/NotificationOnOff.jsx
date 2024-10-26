import React from 'react';
import { TOAST_TYPE } from '../../../constants/common';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotificatinOn } from '../../../slice/battle.slice';

const NotificationOnOff = ({ value }) => {
  const battleState = (state) => state.battle;
  const { isInsertNewItem, isNotificatinOn } = useSelector(battleState);
  const dispatch = useDispatch();

  console.log(isNotificatinOn, 'isNotificatinOn');

  // Function to handle checkbox toggle
  const checkHandler = async () => {
    // Dispatch the toggle action to Redux store
    dispatch(setIsNotificatinOn(!isNotificatinOn));
    ShowToaster(TOAST_TYPE.SUCCESS, "Notification status changed");
  };

  return (
    <div>
      <div className="flex w-full items-center justify-center">
        <label htmlFor={"isNotificatinOnH"} className="-ml-5 flex cursor-pointer items-center">
          <div className="relative">
            <input
              type="checkbox"
              checked={isNotificatinOn} // Use 'checked' instead of 'value'
              onChange={checkHandler}
              id={"isNotificatinOnH"}
              className="sr-only"
            />
            <div className="block h-6 w-10 rounded-full bg-tertiary-t4"></div>
            <div className="dot absolute left-1 right-1 top-1 h-4 w-4 rounded-full bg-secondary transition"></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default NotificationOnOff;
