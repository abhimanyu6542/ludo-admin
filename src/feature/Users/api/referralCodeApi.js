import { supabase } from "../../../config/supabaseClient";


export const fetchReferralCodeApi = async(unique_code) => {
    const response = await supabase
    .from('users')
    .select('created_at, user_name, phone, unique_code, referral_code, full_name, is_banned, wallet(*)')
    .eq('referral_code', unique_code)

    return response;
}