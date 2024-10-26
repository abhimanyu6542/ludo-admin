import { supabase } from "../../../config/supabaseClient";

export const getWalletDataApi = async (phone_number) => {
    const response = await supabase
        .from('wallet')
        .select('balance, total_amount_recharged, total_amount_withdrawn, category, user_id')
        .eq('user_id', phone_number);

    return response;
}