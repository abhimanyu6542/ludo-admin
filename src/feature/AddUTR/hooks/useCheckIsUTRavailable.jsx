import { useState } from 'react';
import { fetchWalletDataApi } from '../api/walletApi';
import { insertWalletDataApi } from '../api/walletApi';
import { fetchTransactionRequestDataApi } from '../api/transactionRequestApi';
import { insertWalletTransactionDataApi } from '../api/walletTransactionApi';


function useCheckIsUTRavailable() {

    const checkUTRAvailability = async (utrNumber, amount) => {

        const { data: transaction_data, error: transaction_error } = await fetchTransactionRequestDataApi(utrNumber);
        if (transaction_error) {
            console.log('Error while fetching transaction data');
            return false;
        }
        else if (transaction_data) {
            console.log('transaction_data -> ', transaction_data);
            if (transaction_data.length !== 0) {
                handlePassDataToWalletTable(transaction_data[0], amount);
                return transaction_data[0];
            }
            return false;
        }
    }


    // -- if utr_no is already present than passing details to "wallet" & "wallet-transaction" table
    const handlePassDataToWalletTable = async (details, amount) => {

        const { data: wallet_data, error: wallet_error } = await fetchWalletDataApi(parseInt(details.user_id))
        let closing_balance = 0;
        if (wallet_error) {
            console.log('Error while fetching wallet data');
            return;
        }
        
        if (wallet_data) {
            console.log('wallet_data -> ', wallet_data);
            if (wallet_data.length === 0) {
                const wallet_obj = {
                    balance: parseInt(amount),
                    total_amount_recharged: parseInt(amount),
                    total_amount_withdrawn: null,
                    category: 'recharge',
                    user_id: parseInt(details.user_id),
                }
                insertWalletDataApi(wallet_obj);
                closing_balance= wallet_obj.balance
            }
            else {
                const wallet_obj = {
                    balance: parseInt(wallet_data[0].balance) + parseInt(amount),
                    total_amount_recharged: parseInt(wallet_data[0].total_amount_recharged) + parseInt(amount),
                    total_amount_withdrawn: parseInt(wallet_data[0].total_amount_withdrawn) + parseInt(amount),
                    category: 'recharge',
                    user_id: parseInt(details.user_id),
                }
                insertWalletDataApi(wallet_obj);
                closing_balance= wallet_obj.balance
            }
        }
        handlePassDataToWalletTransactionTable(transaction_data[0], amount, closing_balance);


    }
    const handlePassDataToWalletTransactionTable = (details, amount, closing_balance) => {
        const wallet_obj = {
            amount: amount,
            transaction_type: 'recharge',
            transaction_request_id: details.id,
            user_id: details.user_id,
            closing_balance
        }
        insertWalletTransactionDataApi(wallet_obj);
    }


    return checkUTRAvailability
}

export default useCheckIsUTRavailable;