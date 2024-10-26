import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  new_withdrawal: [],
  withdrawal_data: [],
};

const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    setNewWithdrawalData(state, action) {
      state.new_withdrawal = action.payload;
    },
    setWithdrawalData(state, action) {
      state.withdrawal_data = action.payload;
    },
    addWithdrawalData(state, action) {
      state.withdrawal_data = [...state.withdrawal_data, action.payload].reverse();
    },
    addNewWithdrawalData(state, action) {
      let updatedWithdrawals = [...state.new_withdrawal, action.payload].reverse();
      // Ensure that the array length doesn't exceed 5
      if (updatedWithdrawals.length > 5) {
        updatedWithdrawals.pop(); // Remove the last item if there are more than 5
      }
      state.new_withdrawal = updatedWithdrawals;
    },
    removeFromWithdrawalData(state, action) {
      if (state.withdrawal_data.map((withdrawal) => withdrawal.id === action.payload)) {
        state.withdrawal_data = [
          ...state.withdrawal_data.filter((withdrawal) => withdrawal.id != action.payload),
        ].reverse();
      }
    },
    removeFromWithdrawalNotification(state, action) {
      if (state.new_withdrawal.map((withdrawal) => withdrawal.id === action.payload)) {
        state.new_withdrawal = [
          ...state.new_withdrawal.filter((withdrawal) => withdrawal.id != action.payload),
        ].reverse();
      }
    },
  },
});

export const {
  setWithdrawalData,
  addWithdrawalData,
  removeFromWithdrawalData,
  setNewWithdrawalData,
  addNewWithdrawalData,
  removeFromWithdrawalNotification,
} = withdrawalSlice.actions;
export default withdrawalSlice.reducer;
