import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  user: null,
  session: null,
  currentTab: 1,
};
 
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    setSession(state, action) {
      state.session = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
  },
});

export const { setSession, setUser, setCurrentTab } = authSlice.actions;
export default authSlice.reducer;
