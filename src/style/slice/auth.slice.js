import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  user: null,
  session: null,
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
  },
});

export const { setSession, setUser } = authSlice.actions;
export default authSlice.reducer;
