import { combineReducers } from 'redux';
// all stores --
import authSlice from '../slice/auth.slice';
import battleSlice from '../slice/battle.slice';
import userSlice from '../slice/userSlice';
import withdrawalSlice from '../slice/withdrawal.slice';
import addMoneySlice from '../slice/addMoney.slice';


const appReducer = combineReducers({
  auth: authSlice,
  battle: battleSlice,
  user: userSlice,
  withdrawal: withdrawalSlice,
  add_money: addMoneySlice
});

const RootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default RootReducer;
