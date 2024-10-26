import { supabase } from "../../../config/supabaseClient";


export const fetchTransactionRequestDataApi = async (utr_no) => {
    const response = await supabase
    .from('transaction_request')
    .select('id, amount, utr_no, status, type, user_id')
    .eq('utr_no', utr_no);

    return response;
}