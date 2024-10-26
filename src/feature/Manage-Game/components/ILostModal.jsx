import React, {  useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { upsertResultApi , postResultApi} from '../../Battles/api/battleApi';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import { queryClient } from '../../../config/react-query';
import { GET_ALL_BATTLE_QUERY_KEY } from '../../Users/constants/userQueryKey';
import { supabase } from '../../../config/supabaseClient';



function ILostModal({ setIsILostModalOpen }) {
  const [isChecked, setIsChecked] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);


  // -- redux
  const battle_details =  useSelector((state) => state.battle.current_battles);
  const access_token = useSelector((state) => state.auth.session.access_token);


  const handleILostButton = async () => {
    console.log('isChecked -> ', isChecked);
    setSubmitButtonClicked(true);

    if (isChecked) {
      const battle_obj = {
        battle_id: battle_details?.id,
        match_response: 'lost',
        screenshot: null,
        remarks: null,
        user_type: (battle_details === battle_details.created_by) ? 'creator' : 'player',
        user_id: battle_details.created_by,
        unique_constraint: `${battle_details?.id + battle_details.created_by}`,
      }
      const post_api = {
        game_id: battle_details?.id,
        jwt_token: access_token
      }
      console.log('battle_obj -> ', battle_obj);

      try {
        const response = await upsertResultApi(battle_obj);
        postResultApi(post_api);
        await supabase.from('users').update({is_playing: false}).eq('user_name', battle_details?.created_by);
        ShowToaster(TOAST_TYPE.SUCCESS, 'Response submitted successfully')
        setIsILostModalOpen(false)
        await queryClient.invalidateQueries({
          queryKey: [GET_ALL_BATTLE_QUERY_KEY],
        });
      } catch (error) {
        console.log('error')
       
      }
    }
  }


  return (
    <div className="fixed left-0  top-0 z-50 flex h-full w-full items-center justify-center overflow-y-scroll bg-[rgba(0,0,0,0.5)]">

      <div className="relative flex w-96 flex-col items-center rounded-md border-0 bg-white py-4 px-5">
        <RxCross2 onClick={() => setIsILostModalOpen(false)} className='absolute w-6 h-6 top-2 right-2' />
        <h2 className='w-full mb-2 text-sm font-semibold text-center text-gray-800'>Are you sure you lost this game?</h2>
        <h2 className='mb-5 text-xs text-gray-800'>क्या आप निश्चित है आप हार गए हैं?</h2>

        <div className='flex items-center gap-4 '>
          <input
            id='confirmed'
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.value)}
            className='w-4 h-4'
          />
          <label htmlFor="confirmed" className='text-sm font-semibold text-blue-500'>Yes, I Confirm</label>
        </div>
        {(!isChecked && submitButtonClicked) ? <p className='text-xs font-medium text-rose-500'>Please confirm.</p> : ''}

        <button onClick={handleILostButton} className='w-full py-2 mt-6 mb-3 text-sm font-semibold text-white bg-red-500'>Yes, I lost</button>
        <button onClick={() => setIsILostModalOpen(false)} className='w-full py-2 text-sm font-semibold text-white bg-gray-500'>No</button>
      </div>


    </div>
  )
}

export default ILostModal;