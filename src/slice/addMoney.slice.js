import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  add_money_data: [],
  new_add_money: [],
};

const addMoneySlice = createSlice({
  name: 'add_money',
  initialState,
  reducers: {
    setAddMoneyData(state, action) {
      state.add_money_data = action.payload;
    },
    addAddMoneyData(state, action) {
      state.add_money_data = [...state.add_money_data, action.payload].reverse();
    },
    removeFromAddMoneyData(state, action) {
      if (state.add_money_data.map((money) => money.id === action.payload)) {
        state.add_money_data = [
          ...state.add_money_data.filter((money) => money.id != action.payload),
        ].reverse();
      }
    },
    addNewAddMoneyData(state, action) {
      let updatedAddMoney = [...state.new_add_money, action.payload].reverse();
      // Ensure that the array length doesn't exceed 5
      if (updatedAddMoney.length > 5) {
        updatedAddMoney.pop(); // Remove the last item if there are more than 5
      }
      state.new_add_money = updatedAddMoney;
    },
    removeFromAddMoneyNotification(state, action) {
      if (state.new_add_money.map((money) => money.id === action.payload)) {
        state.new_add_money = [
          ...state.new_add_money.filter((money) => money.id != action.payload),
        ].reverse();
      }
    },
  },
});

export const {
    setAddMoneyData,
    addNewAddMoneyData,
    addAddMoneyData,
    removeFromAddMoneyNotification,
    removeFromAddMoneyData,
} = addMoneySlice.actions;
export default addMoneySlice.reducer;
