import { setSession, setUser } from '../../../slice/auth.slice';
import useLogout from './useLogout';
import { LOCAL_STORAGE_KEYS } from '../../../constants/common';
import { fetchSettingApi } from '../../Settings/api/settingApi';
import { fetchUserDataApi } from '../../Users/api/userApi';
import { setAllUser, setManagedUser } from '../../../slice/userSlice';

const logOutTheUser = (navigate, dispatch) => {
  useLogout(navigate, dispatch);
};
const useAppCheckUp = async (loginData, navigate, dispatch) => {
  try {
    if (!loginData) {
      // Logut the user.
      logOutTheUser(navigate, dispatch);
      return;
    }
    const userDataToBeSaved = loginData.user;
    console.log(userDataToBeSaved);
    if(userDataToBeSaved?.app_metadata?.claims_admin === false){
      console.log("You are not admin")
      logOutTheUser(navigate, dispatch);
    } 

    const sessionDataTobeSaved = { ...loginData.session };
    delete sessionDataTobeSaved.user;
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, loginData.session.access_token);

    dispatch(setUser(userDataToBeSaved));
    dispatch(setSession(sessionDataTobeSaved));
    await fetchSettingApi()

  
    // fetch and store manage user data
    let response = await fetchUserDataApi();
        // console.log('Fetched Data:', response.data); // Check the structure

        // Ensure data.data exists and is an array
        if (Array.isArray(response.data)) {
          dispatch(setAllUser(response.data))
          const manageTrue = response.data.filter((item) => item.is_managed === true);
        
          dispatch(setManagedUser(manageTrue))
          
        }

    if(userDataToBeSaved?.app_metadata?.claims_admin === true){
    
      navigate('/home');
    }else {
      navigate('/users');
      
    }
  } catch (error) {
    console.error('Error in useAppCheckUp:', error);
    logOutTheUser(navigate, dispatch);
  }
};

export default useAppCheckUp;
