import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  managed_user: [],
  all_user: [],
  bank_details: null,
  user_name: null,
  user_number: null,
  unique_code: null,
  referral_code: null,
  full_name: null,
  is_banned: null,
  user_info: null,
  wallet_data: null,
  total_battles: null,
  win_battles: null,
  loss_battles: null
};

const userSlice = createSlice({
  name: 'selected_user',
  initialState,
  reducers: {
    setManagedUser(state, action) {
      state.managed_user = action.payload;
    },
    setAllUser(state, action) {
      state.all_user = action.payload;
    },
    setBankDetails(state, action) {
      state.bank_details = action.payload;
    },
    setUserName(state, action) {
      state.user_name = action.payload;
    },
    setUserNumber(state, action) {
      state.user_number = action.payload;
    },
    setUniqueCode(state, action) {
      state.unique_code = action.payload;
    },
    setReferralCode(state, action) {
      state.referral_code = action.payload;
    },
    setFullName(state, action) {
      state.full_name = action.payload;
    },
    setIsBanned(state, action) {
      state.is_banned = action.payload;
    },
    setUserInfo(state, action) {
      state.user_info = action.payload;
    },
    setWalletData(state, action) {
      state.wallet_data = action.payload;
    },
    setTotalBattles(state, action) {
      state.total_battles = action.payload;
    },
    setWinBattles(state, action) {
      state.win_battles = action.payload;
    },
    setLossBattles(state, action) {
      state.loss_battles = action.payload;
    },
  },
});

export const {
  setUserName,
  setManagedUser,
  setAllUser,
  setBankDetails,
  setUserNumber,
  setUniqueCode,
  setReferralCode,
  setFullName,
  setIsBanned,
  setUserInfo,
  setWalletData,
  setTotalBattles,
  setWinBattles,
  setLossBattles
} = userSlice.actions;
export default userSlice.reducer;
