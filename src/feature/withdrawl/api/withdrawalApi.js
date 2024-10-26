import { supabase } from "../../../config/supabaseClient";


export const fetchWithdrawalData = async() => {
    const response = await supabase
    .from('transaction_request')
    .select('id, created_at, amount, utr_no, status, type, user_id, users(full_name)')
    .eq('type', 'withdrawn');

    return response;
}
export const deleteWithdrawalDataApi = async (id) => {
    const response = await supabase.from("transaction_request").delete().eq('id', id);
    return response;
  };