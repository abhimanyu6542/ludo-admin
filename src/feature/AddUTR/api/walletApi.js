import { supabase } from "../../../config/supabaseClient";


export const fetchWalletDataApi = async (user_id) => {
    const response = await supabase
        .from('wallet')
        .select('balance, total_amount_recharged, total_amount_withdrawn, category, user_id')
        .eq('user_id', user_id);

    return response;
}


export const insertWalletDataApi = async (wallet_data) => {
    const response = await supabase
        .from('wallet')
        .upsert(wallet_data, { onConflict: ['user_id'] })
        .select()

    return response;
}