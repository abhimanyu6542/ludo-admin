import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import { upsertResultApi, postResultApi } from '../../Battles/api/battleApi';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import { queryClient } from '../../../config/react-query';
import { GET_ALL_BATTLE_QUERY_KEY } from '../../Users/constants/userQueryKey';
import { supabase } from '../../../config/supabaseClient';

function IWonModal({ setIsIWonModalOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  // -- redux
  const battle_details = useSelector((state) => state.battle.current_battles);
  const access_token = useSelector((state) => state.auth.session.access_token);

  const handleSubmit = async () => {
    setIsLoading(true);

    const battle_obj = {
      battle_id: battle_details?.id,
      match_response: 'won',
      screenshot: null,
      remarks: null,
      user_type: battle_details.created_by === battle_details.created_by ? 'creator' : 'player',
      user_id: battle_details.created_by,
      unique_constraint: `${battle_details?.id + battle_details.created_by}`,
    };
    const post_api = {
      game_id: battle_details?.id,
      jwt_token: access_token,
    };

    try {
      const response = await upsertResultApi(battle_obj);
      await postResultApi(post_api);
      await supabase.from('users').update({is_playing: false}).eq('user_name', battle_details?.created_by);
      setIsLoading(false);
      ShowToaster(TOAST_TYPE.SUCCESS, 'Response submitted successfully')
      setIsIWonModalOpen(false)
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_BATTLE_QUERY_KEY],
      });
    } catch (error) {
      console.log('error');
      console.log(error);
      ShowToaster(TOAST_TYPE.SUCCESS, 'Something went wrong')
    }
  };

  return (
    <div className="fixed left-0  top-0 z-50 flex h-full w-full items-center justify-center overflow-y-scroll bg-[rgba(0,0,0,0.5)]">
      <div className="relative mx-3 my-2 flex w-96 flex-col rounded-md border-0 bg-white p-4">
        <RxCross2
          onClick={() => setIsIWonModalOpen(false)}
          className="absolute w-6 h-6 top-2 right-2"
        />

        <p>Are you win the match ?</p>

        <button
          disabled={isLoading}
          onClick={() => handleSubmit()}
          className="w-full py-2 mt-4 text-sm font-semibold text-white bg-red-500"
        >
          {isLoading ? 'Submitting..' : 'Yes'}
        </button>
      </div>
    </div>
  );
}

export default IWonModal;
