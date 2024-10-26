import { supabase } from "../../../config/supabaseClient";


export const fetchAddMoneyData = async() => {
    const response = await supabase
    .from('transaction_request')
    .select('id, created_at, amount, utr_no, status, type, user_id, users(full_name)')
    .eq('type', 'add');

    return response;
}