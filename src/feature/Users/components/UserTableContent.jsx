/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { formatDate } from '../../../utils/Search/convertDate';
// table-parts
import TableBody from '../../../components/Table/TableBody';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import EditCell from './EditCell';
import useGetUsersQuery from '../hooks/useGetUsersQuery';
// import { useSelector } from 'react-redux';
import useDebounce from '../../../hooks/useDebounce';
import { SearchUser } from '../utils/SearchUser';
import IconCell from './IconCell';
import PlayCell from './PlayCell';
import { HiOutlinePlusSmall } from 'react-icons/hi2';
import { Status_Array } from '../../../constants/status_array';
import { supabase } from '../../../config/supabaseClient';
import {
  generateRandomElevenDigitNumber,
  generateRandomName,
  generateRandomTenDigitNumber,
  generateReferralCode,
  generateUniqueCode,
} from '../utils/generateRandom';

import { queryClient } from '../../../config/react-query';
import { GET_USERS_QUERY_KEY } from '../constants/userQueryKey';
import { fetchUserDataApi } from '../api/userApi';
import { setManagedUser } from '../../../slice/userSlice';
import { useDispatch } from 'react-redux';

const UserTableContent = () => {
  const getSchema = () => {
    const columns = [
      {
        Header: `Username`,
        accessor: 'user_name',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original?.user_name ? row.original.user_name : 'Not Available'}
          />
        ),
      },
      {
        Header: `Phone`,
        accessor: 'phone',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original?.phone ? row.original.phone : 'Not Available'} />
        ),
      },
      // {
      //   Header: `Email`,
      //   accessor: 'email',
      //   Cell: ({ row }) => (
      //     <GenericTextCell value={row.original?.user_kyc_request[0]?.email ? row.original.user_kyc_request[0]?.email : 'Not Available'} />
      //   ),
      // },
      // {
      //   Header: `KYC`,
      //   accessor: 'kyc_status',
      //   Cell: ({ row }) => (
      //     <IconCell value={row.original?.user_kyc_request ? row.original.user_kyc_request : 'Not Available'} />
      //   ),
      // },

      {
        Header: `Signed On`,
        accessor: 'created_at',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.created_at ? formatDate(row.original.created_at) : 'Not Available'}
          />
        ),
      },

      {
        Header: `Actions`,
        Cell: ({ row }) => <EditCell row={row} />,
      },
    ];
    return columns;
  };

  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('query') ?? '';
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const debounceSearchText = useDebounce(searchText);

  const filters = useMemo(() => {
    return {
      search: debounceSearchText,
    };
  }, [debounceSearchText]);

  const userData = useGetUsersQuery(filters);
  // console.log('userData -> ', userData?.data?.data);
  const column = getSchema();

  const [status, setStatus] = useState('All');
  function handleDropDown(e) {
    setStatus(e.target.value);
  }

  const data = userData?.data?.data || [];
  // Create a new sorted array to avoid mutating the original array
  const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const createNewUser = async () => {
    try {
      setIsLoading(true);
      const phone_number = generateRandomElevenDigitNumber();
      const full_name = generateRandomName();
      const user_name = generateUniqueCode(full_name);
      const unique_code = generateReferralCode();
      // save user data to db table
      const insertUserdataPayload = {
        user_name,
        phone: phone_number,
        unique_code,
        full_name: full_name,
        is_managed: true,
      };
      console.log(insertUserdataPayload, 'insertUserdataPayload');
      const { error: insertUsererror } = await supabase
        .from('users')
        .insert([insertUserdataPayload])
        .select();
      if (insertUsererror) {
        console.log('insertUsererror', insertUsererror);
        throw insertUsererror;
      }
      const wallet_obj = {
        user_id: phone_number,
        balance: Number(50000),
      };
      const { error: wallet_error } = await supabase
        .from('wallet')
        .upsert(wallet_obj, { onConflict: 'user_id' });
      if (wallet_error) {
        setIsLoading(false);
        throw new Error('Error while inserting new Transaction');
      }
      await queryClient.refetchQueries({
        queryKey: [{ scope: GET_USERS_QUERY_KEY }],
      });

      // fetch and store manage user data
      let response = await fetchUserDataApi();
      // console.log('Fetched Data:', response.data); // Check the structure

      // Ensure data.data exists and is an array
      if (Array.isArray(response.data)) {
        const manageTrue = response.data.filter((item) => item.is_managed === true);

        dispatch(setManagedUser(manageTrue));
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  };
  return (
    <div>
      <div className="w-full px-2 py-3 mb-2 border-0 rounded-md bg-secondary lg:px-6 lg:py-7">
        <div className="flex items-center justify-between mb-3 w-[70%]">
          <h1 className="text-2xl font-bold font-poppins">Users</h1>

          <SearchUser />
          <div className="flex items-center justify-start gap-3">
            <p className="font-poppins">Status</p>
            <strong className="font-medium">
              <select
                className="w-full px-10 py-1 text-sm border rounded-md outline-none cursor-pointer border-tertiary-t3 bg-tertiary-t2 text-tertiary-t5 sm:py-2"
                id="status"
                name="status"
                value={status}
                onChange={handleDropDown}
              >
                {Status_Array.map((i) => (
                  <option
                    key={i}
                    value={i}
                    className="px-5 py-2 mb-2 leading-5 bg-primary font-poppins text-tertiary-t3"
                  >
                    {i}
                  </option>
                ))}
              </select>
            </strong>
          </div>

          <div className="flex justify-end self-end">
            <button
              onClick={createNewUser}
              className="px-5 py-2 border-2 flex justify-center  bg-[#065F46] text-[#FFFFFF] rounded-md"
            >
              {isLoading ? (
                <BasicSpinner />
              ) : (
                <div className="flex items-center gap-3">
                  {' '}
                  <HiOutlinePlusSmall className="w-6 h-6 text-white" /> Create User{' '}
                </div>
              )}
            </button>
          </div>
        </div>
        {userData.isLoading || userData.isFetching ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : userData?.data?.data?.length === 0 ? (
          <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
            No Data Available
          </div>
        ) : (
          <TableBody columns={column} data={sortedData} />
        )}
      </div>
    </div>
  );
};

export default UserTableContent;