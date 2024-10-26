import { supabase } from "../../../config/supabaseClient";

export const upsertBankDetailsApi = async(bank_detail) => {
    const response = await supabase
    .from('bank_details')
    .upsert(bank_detail, {onConflict: 'user_id'})
    .select();

    return response;
}