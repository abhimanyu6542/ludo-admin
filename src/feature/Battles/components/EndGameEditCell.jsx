/* eslint-disable react/prop-types */
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentBattles } from '../../../slice/battle.slice';

const EndGameEditCell = ({ row, isEndBattle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleUserView = () => {
    dispatch(setCurrentBattles(row.original));
    
   // Check if it's an End Battle or Cancel Battle and navigate accordingly
   const route = isEndBattle ? `end/${row.original.id}` : `cancel/${row.original.id}`;
   navigate(route);
  };

  return (
    <>
      <div className="flex items-center justify-start">
        <button
          onClick={handleUserView}
          className="rounded-full mx-2 border-0 p-1.5 text-orange-600 hover:bg-secondary"
        >
          <AiOutlineEye />
        </button>
      </div>
    </>
  );
};

export default EndGameEditCell;
