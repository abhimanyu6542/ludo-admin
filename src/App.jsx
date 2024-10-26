import React from 'react';
import { Outlet } from 'react-router-dom';
import { useGetAllBattles } from './feature/Battles/hooks/useGetAllBattles';
import { useGetBattleResponse } from './feature/Battles/hooks/useGetBattleResponse';
import { useDispatch, useSelector } from 'react-redux';
import NotificationModal from './feature/notifiaction/components/NotificationModal';
import { setIsModalOpen } from './slice/battle.slice';
function App() {
  const battleState = (state) => state.battle;
  const { isInsertNewItem, isModalOpen } = useSelector(battleState);
  const dispatch = useDispatch();
  const handleBack = () => {
    dispatch(setIsModalOpen(false));
  };
  useGetBattleResponse();
  return (
    <>
      <div className='bg-white'>
      <Outlet />
      {isModalOpen ? <NotificationModal clickEvent={handleBack} /> : null}
      </div>
    </>
  );
}

export default App;
