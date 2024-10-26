import { supabase } from '../../../config/supabaseClient';
import { DB_TABLE_NAME } from '../../../constants/common';
import { dateFormater } from '../../../utils/Search/dateFormater';

export const getTotalwithdrawnData = async (startDate, endDate) => {
  let totalSum = 0;

  let response = supabase
    .from(DB_TABLE_NAME.WALLET_TRANSACTION)
    .select(`amount, created_at`)
    .filter('transaction_type', 'eq', 'withdrawn');

  if (startDate && endDate) {
    const newEndDate = new Date(endDate);
    newEndDate.setTime(newEndDate.getTime() + 86400000);
    response = response.gte('created_at', startDate).lte('created_at', dateFormater(newEndDate));
  }
  const data = (await response).data;
  data.forEach((items) => {
    totalSum += parseFloat(items.amount);
  });

  return totalSum;
};

export const getTotalRechargeData = async (startDate, endDate) => {
  let totalSum = 0;

  let response = supabase
    .from(DB_TABLE_NAME.WALLET_TRANSACTION)
    .select(`amount, created_at`)
    .filter('transaction_type', 'eq', 'recharge');

  if (startDate && endDate) {
    const newEndDate = new Date(endDate);
    newEndDate.setTime(newEndDate.getTime() + 86400000);
    response = response.gte('created_at', startDate).lte('created_at', dateFormater(newEndDate));
  }
  const data = (await response).data;
  data.forEach((items) => {
    totalSum += parseFloat(items.amount);
  });

  return totalSum;
};

export const getTotalCommissionData = async (startDate, endDate) => {
  let totalSum = 0;

  let response = supabase
    .from(DB_TABLE_NAME.ADMIN_TRANSACTION)
    .select(`amount, created_at`)
    .filter('txn_type', 'eq', 'commission');

  if (startDate && endDate) {
    const newEndDate = new Date(endDate);
    newEndDate.setTime(newEndDate.getTime() + 86400000);
    response = response.gte('created_at', startDate).lte('created_at', dateFormater(newEndDate));
  }
  const data = (await response).data;

  data.forEach((items) => {
    totalSum += parseFloat(items.amount);
  });
  return totalSum;
};

export const getTotalBattleData = async (startDate, endDate) => {
  let totalSum = 0;

  let response = supabase.from(DB_TABLE_NAME.BATTLE).select(`id`);

  if (startDate && endDate) {
    const newEndDate = new Date(endDate);
    newEndDate.setTime(newEndDate.getTime() + 86400000);
    response = response.gte('created_at', startDate).lte('created_at', dateFormater(newEndDate));
  }
  const data = (await response).data;

  totalSum = data.length;
  return totalSum;
};
