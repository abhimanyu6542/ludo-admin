import { useMutation } from '@tanstack/react-query'; 
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { TOAST_TYPE } from '../../../constants/common';
import { useQueryClient } from '@tanstack/react-query';
import { UTR_QUERY_KEY } from '../constants/utrQuerKey';
import { insertUTRDataApi } from '../api/utrApi';


function useAddUTRMutation() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (utr_data) => {
      return insertUTRDataApi(utr_data)
    },
    onError: () => {
      console.log('Error in adding UTR data');
      ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
    },
    onSuccess: () => {
      ShowToaster(TOAST_TYPE.SUCCESS, 'UTR data added successfully');
      queryClient.refetchQueries({queryKey: [UTR_QUERY_KEY],});
    }
  })

  return addMutation;
}

export default useAddUTRMutation;