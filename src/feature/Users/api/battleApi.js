import { supabase } from '../../../config/supabaseClient';
import { BATTLE_STATUS, DB_TABLE_NAME } from '../../../constants/common';

export const insertBattleApi = async (payload) => {
  const response = await supabase.from(DB_TABLE_NAME.BATTLE).insert([payload]).select();

  return response;
};
export const fetchBattleDataApi = async (user_name) => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .select('created_at, created_by, accepted_by, prize, battle_status, entry_fee, winner')
    .or(`created_by.eq.${user_name},accepted_by.eq.${user_name}`)
    .order('created_at', { ascending: false });

  return response;
};
export const fetchAllBattleDataApi = async (managedUser) => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .select(`*`)
    .in('created_by', managedUser)
    .in('battle_status', [BATTLE_STATUS.ONGOING, BATTLE_STATUS.WAITING]) // Add this line to filter by status
    .order('created_at', { ascending: false });

  return response;
};
export const fetchCancleResponseBattleDataApi = async (gameId) => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .select(`*`)
    .in('id', gameId)
    .order('created_at', { ascending: false });

  return response;
};

export const fetchReferredUserBattleDataApi = async (user_name) => {
  const response = await supabase
    .from(DB_TABLE_NAME.BATTLE)
    .select('created_at, created_by, accepted_by, prize, battle_status, entry_fee, winner')
    .eq('battle_status', BATTLE_STATUS.COMPLETED)
    .in('winner', user_name)
    .order('created_at', { ascending: false });

  return response;
};
