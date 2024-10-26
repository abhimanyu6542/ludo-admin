import { supabase } from "../../../config/supabaseClient";


export const insertWalletTransactionDataApi = async (details) => {
    const response = await supabase
    .from('wallet_transaction')
    .insert([details])

    return response;
}