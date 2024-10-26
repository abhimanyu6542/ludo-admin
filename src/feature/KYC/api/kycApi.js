import { supabase } from '../../../config/supabaseClient';
import { DB_TABLE_NAME } from '../../../constants/common';

export const getKycDataApi = async () => {
  const response = await supabase.from(DB_TABLE_NAME.USER_KYC_REQUEST).select(`id, created_at, user_id, email, aadhaar_number, dob, kyc_status, aadhaar_front, aadhaar_back, full_name,comments,  users(user_name, full_name)`)
  .order('created_at', { ascending: false });

  return response;
};

export const updateKycDataApi = async (payload) => {
  return await supabase.from(DB_TABLE_NAME.USER_KYC_REQUEST).update(payload)
  .eq('id', payload.id)
  .select();
};

