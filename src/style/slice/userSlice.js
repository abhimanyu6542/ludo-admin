import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_name: null,
  user_number: null,
  unique_code: null,
  referral_code: null,
  full_name: null,
  is_banned: null,
};

const userSlice = createSlice({
  name: 'selected_user',
  initialState,
  reducers: {
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
  },
});

export const {
  setUserName,
  setUserNumber,
  setUniqueCode,
  setReferralCode,
  setFullName,
  setIsBanned,
} = userSlice.actions;
export default userSlice.reducer;
