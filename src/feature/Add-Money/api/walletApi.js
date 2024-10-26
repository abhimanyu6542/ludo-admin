import { supabase } from "../../../config/supabaseClient";


export const fetchWalletDataApi = async (user_id) => {
    const response = await supabase
        .from('wallet')
        .select('balance, total_amount_withdrawn')
        .eq('user_id', user_id)

    return response;
}
export const fetchBankDataApi = async (user_id) => {
    const response = await supabase
        .from('bank_details')
        .select('account_number, ifsc, bank_name, full_name, upi_id')
        .eq('user_id', user_id)

    return response;
}

export const updateWalletDataApi = async (wallet_data) => {
    const response = await supabase
        .from('wallet')
        .upsert(wallet_data, { onConflict: 'user_id' })
        .select();

    return response;
}

export const insertWalletTransactionDataApi = async (wallet_data) => {
    const response = await supabase
        .from('wallet_transaction')
        .insert([wallet_data])

    return response;
}

export const updateTransactionRequestDataApi = async (transaction_data) => {
    const response = await supabase
        .from('transaction_request')
        .update(transaction_data)
        .eq('id', transaction_data.id)
        .select();

    return response;
}