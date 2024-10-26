import { supabase } from '../../../config/supabaseClient';
import { BATTLE_STATUS, DB_TABLE_NAME } from '../../../constants/common';
import axios from 'axios';

export const getOngoingBattledataApi = async () => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .select(`*`)
    .eq('battle_status', BATTLE_STATUS.ONGOING);

  return response;
};

export const getCompletedBattledataApi = async () => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .select(`*`)
    .eq('battle_status', BATTLE_STATUS.COMPLETED);

  return response;
};
export const getDisputedBattledataApi = async () => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .select(`*`)
    .eq('battle_status', BATTLE_STATUS.DISPUTED);

  return response;
};
export const getBattleUserResponseDataApi = async (id) => {
  const data = await supabase
    .from(DB_TABLE_NAME.BATTLE_USER_RESPONSE)
    .select(`*, users(phone)`)
    .eq('battle_id', id);

  return data;
};

export const updateBattledataApi = async (id, payload) => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .update(payload)
    .eq("id", id)
    .select();

  return response;
};





export const upsertResultApi = async (result_data) => {
    const response = await supabase
        .from('battle_user_response')
        .upsert(result_data, { onConflict: 'unique_constraint' })
        .select()

    return response;
}





export const postResultApi = (battle_data) => {
    // Data to be sent in the POST request
    const data = battle_data
    const url = 'https://rupbhkrgwi.execute-api.ap-south-1.amazonaws.com/api/v1/process-game';
    // const url = 'http://localhost:3000/api/v1/process-game';

    // Making the POST request
    axios.post(url, data)
}

export const deleteBattleApi = async(battle_data) => {
  // Data to be sent in the POST request
  const data = battle_data
  const url = 'https://rupbhkrgwi.execute-api.ap-south-1.amazonaws.com/api/v1/game-delete';

  // Making the POST request
  return axios.post(url, data)
}
