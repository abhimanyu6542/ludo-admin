import { supabase } from '../../../config/supabaseClient';

export const fetchSettingApi = async () => {
  const { data, error } = await supabase.from('app_setting').select('referral_commission,game_commission, upi_id_1,upi_id_2, upi_id_3, upi_id_4');
  if (error) {
    return 'Something went wrong';
  }

  return data[0];
};
export const updateSettingApi = async (payload) => {
  console.log(payload, "payload")
  const { error } = await supabase.from('app_setting').update(payload).eq('id', 1).select();
  if (error) {
    return false;
  }

  return true;
};

export const getBroadcastMsg = async () => {
  const response = await supabase.from('broadcast_message').select('message').eq('type', 'notice');
  return response;
}

export const deleteBroadcastMsg = async () => {
  const response = await supabase.from('broadcast_message').update({message: 'NULL'}).eq('type', 'notice');
  return response;
}

export const setBroadcastMsg = async (msg) => {
  const response = await supabase.from('broadcast_message').update({message: msg}).eq('type', 'notice');
  return response;
}
