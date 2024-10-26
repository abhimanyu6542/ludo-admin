// import React from 'react';
import { supabase } from '../../../config/supabaseClient';
import { LOCAL_STORAGE_KEYS } from '../../../constants/common';
import { resetStore } from '../../../redux/ReduxStore';

async function useLogout(navigate, dispatch) {
  // 1. logout-User --
  const { error } = await supabase.auth.signOut();
  if (!error) {
    navigate('/auth');
  }

  // 2. Clear the session from the local storage --
  localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSION);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);

  // 3. Reset the redux store --
  dispatch(resetStore());
}

export default useLogout;
