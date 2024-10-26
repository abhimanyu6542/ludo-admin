import { supabase } from '../../../config/supabaseClient';
import { fetchReferredUserBattleDataApi } from './battleApi';

export const fetchUserDataApi = async (searchText) => {
  let response = null;

  if (!searchText) {
    response = await supabase
      .from('users')
      .select(
        'created_at, user_name, is_managed, is_playing, phone, unique_code, referral_code, battles, win_battles, loss_battles, full_name, is_banned, wallet(total_amount_recharged, balance, total_amount_withdrawn, referral_earning), bank_details(account_number, ifsc, bank_name, full_name, upi_id)'
      );
  } else {
    response = await supabase
      .from('users')
      .select(
        'created_at, user_name, is_managed, is_playing, phone, unique_code, referral_code, battles, win_battles, loss_battles, full_name, is_banned, wallet(total_amount_recharged, balance, total_amount_withdrawn, referral_earning), bank_details(account_number, ifsc, bank_name, full_name, upi_id)'
      )
      .ilike('search_column', `%${searchText}%`);
  }

  return response;
};

// user_kyc_request(email, kyc_status)
// user_kyc_request(email, kyc_status)
export const fetchUserUsingRefCodeDataApi = async (referral_code) => {
  let user_res = null;
  let response = null;
  let allUserArray = [];
  let allBattleDataArray = [];

  const dataObj = {
    "error": null,
    "data": [],
    "count": null,
    "status": 200,
    "statusText": ""
}

  user_res = await supabase.from('users').select('user_name').match({ referral_code });

  if (user_res.error) {
    return user_res.error;
  }

  allUserArray.push(user_res.data.map((item) => item.user_name));

  // console.log(allUserArray[0], 'allUserArray')
  if(allUserArray[0].length < 1){
    allBattleDataArray.push(dataObj)
  }

  if (allUserArray[0].length > 0) {

      const battleRes = await fetchReferredUserBattleDataApi(allUserArray[0]);
      allBattleDataArray.push(battleRes);
    
  }

  response = allBattleDataArray[0];

  return response;
};
