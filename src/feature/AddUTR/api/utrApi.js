import { supabase } from '../../../config/supabaseClient';
import { DB_TABLE_NAME } from '../../../constants/common';

export const getUTRDataApi = async () => {
  const response = await supabase
    .from(DB_TABLE_NAME.SAVE_UTR)
    .select(`id, created_at, claimed_by, utr_no, amount, utr_status, users(user_name, full_name)`);

  return response;
};

export const insertUTRDataApi = async (utr_data) => {
  const response = await supabase
    .from(DB_TABLE_NAME.SAVE_UTR)
    .insert([utr_data])

  return response;
}

export const deleteUTRDataApi = async (payload) => {
  return await supabase.from(DB_TABLE_NAME.SAVE_UTR).delete().eq('id', payload);
};
