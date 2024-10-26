import { supabase } from "../../../config/supabaseClient";

export const fetchTransactionRequestDataApi = async (user_id) => {
    const response = await supabase
        .from('wallet_transaction')
        .select('id, created_at, amount, transaction_type, transaction_request_id, battle_id, closing_balance')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    return response;
}