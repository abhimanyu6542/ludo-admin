import { toast } from 'react-toastify';
import { TOAST_TYPE } from '../../constants/common';

export const ShowToaster = (type, message) => {
  switch (type) {
    case TOAST_TYPE.ERROR: {
      toast.error(`${message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: true,
        style:{
          width: "100%",
          marginRight: "30px"
        }
      });
      break;
    }
    case TOAST_TYPE.SUCCESS: {
      toast.success(`${message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: true,
        style:{
          width: "100%",
          marginRight: "30px"
        }
      });
      break; 
    }
    case TOAST_TYPE.INFO: {
      toast.info(`${message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: true,
        style:{
          width: "100%",
          marginRight: "30px"
        }
      });
      break; 
    }
    case TOAST_TYPE.WARN: {
      toast.warn(`${message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: true,
        style:{
          width: "100%",
          marginRight: "30px"
        }
      });
      break; 
    }
    default:
      break;
  }
};
