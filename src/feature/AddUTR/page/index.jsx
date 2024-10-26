import React, { useState } from 'react';
import axios from 'axios';
import TableBody from '../../../components/Table/TableBody';
import { SearchUser } from '../../Users/utils/SearchUser';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import UtrStatusCell from '../components/utrStatusCell';
import { HiOutlinePlusSmall } from 'react-icons/hi2';
import { useGetUTRQuery } from '../hooks/useGetUTRQuery';
import { formatDate } from '../../../utils/Search/convertDate';
import { TOAST_TYPE } from '../../../constants/common';
import { ShowToaster } from '../../../components/Toaster/Toaster';
import { queryClient } from '../../../config/react-query';
import { UTR_QUERY_KEY } from '../constants/utrQuerKey';
import { useSelector } from 'react-redux';
import UtrEditCell from '../components/UtrEditCell';

const authSesionState = (state) => state.auth.session;
const AddUTRTable = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [utrNumber, setUTRNumber] = useState();
  const [amount, setAmount] = useState();
  const [isNewUTRadded, setIsNewUTRadded] = useState(false);



  const {access_token} = useSelector(authSesionState);

  const handleAddNewUTRData = async () => {
    setIsNewUTRadded(true);
    if (utrNumber && amount) {
      setIsLoading(true);

      // -- checking if utr is already preseing in transaction_request (table);
      const url = 'https://070lnqnmoi.execute-api.ap-south-1.amazonaws.com/api/v1/add-utr-request';
      const data = {
        utr_number: utrNumber,
        amount: amount,
        jwt_token: access_token
      }

      axios.post(url, data)
        .then(response => {
          console.log('Response data:', response.data);
          if (response.data.response === true) {
            queryClient.refetchQueries({ queryKey: [UTR_QUERY_KEY], });
            ShowToaster(TOAST_TYPE.SUCCESS, 'New Data is Inserted');
          } else if (response.data.response === false) {
            ShowToaster(TOAST_TYPE.ERROR, 'Error while matching Data');
          }
          setUTRNumber('');
          setAmount('');
          setIsLoading(false);
          setIsNewUTRadded(false);
        })
        .catch(error => {
          // Handle error
          console.error('There was an error!', error);
          setIsLoading(false);
          setIsNewUTRadded(false);
          ShowToaster(TOAST_TYPE.ERROR, 'Something went wrong');
        });
    }

  }

  const getSchema = () => {
    const columns = [
      {
        Header: `UTR`,
        accessor: 'utr_no',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.utr_no ? row.original.utr_no : 'Not Available'}
          />
        ),
      },
      {
        Header: `Created On`,
        accessor: 'created_at',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.created_at ? formatDate(row.original.created_at) : 'Not Available'}
          />
        ),
      },
      {
        Header: `Amount`,
        accessor: 'amount',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.amount ? row.original.amount : 'Not Available'} />
        ),
      },

      {
        Header: `Status`,
        accessor: 'utr_status',
        Cell: ({ row }) => (
          <UtrStatusCell row={row} value={row.original.utr_status ? row.original.utr_status : 'Not Available'} />
        ),
      },
      {
        Header: `Actions`,
        Cell: ({ row }) => <UtrEditCell row={row} />,
      },
    ];
    return columns;
  };

  const UTRData = useGetUTRQuery()
  const column = getSchema();


  return (
    <div>
      <div className="w-full px-2 py-3 lg:px-6 lg:py-7">
        <div className="w-full mb-3">
          <h1 className="mb-10 text-2xl font-medium font-poppins">Add new UTR number</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col'>
                  <input
                    type="text"
                    value={utrNumber}
                    disabled={isLoading}
                    onChange={(e) => setUTRNumber(e.target.value)}
                    placeholder="Add new UTR number"
                    className="px-3 py-2 text-lg border-2 border-gray-300 rounded-md outline-none"
                  />
                  {(isNewUTRadded && !utrNumber) ? <small className='text-xs font-medium text-rose-600'>Required !!!</small> : null}
                </div>
                <div className='flex flex-col'>
                  <input
                    type="number"
                    value={amount}
                    disabled={isLoading}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount in Rupees"
                    className="px-3 py-2 text-lg border-2 border-gray-300 rounded-md outline-none"
                  />
                  {(isNewUTRadded && !amount) ? <small className='text-xs font-medium text-rose-600'>Required !!!</small> : null}
                </div>
              </div>
              <button onClick={handleAddNewUTRData} disabled={isLoading} className="px-5 py-2 border-2 flex justify-center  bg-[#065F46] text-[#FFFFFF] rounded-md">
                {isLoading ? <BasicSpinner /> : <div className='flex items-center gap-3'> <HiOutlinePlusSmall className="w-6 h-6 text-white" /> Add </div>}
              </button>
            </div>
            <SearchUser />
          </div>
        </div>

        {/* -- table displaying section */}
        {
          UTRData.isLoading || UTRData.isFetching ? (
            <div className="flex items-center justify-center w-full my-20">
              {' '}
              <BasicSpinner />{' '}
            </div>
          ) : UTRData.data.data.length === 0 ? (
            <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
              No Data Available
            </div>
          ) : (
            <TableBody columns={column} data={UTRData.data.data} />
          )}
        {/* <TableBody columns={column} data={data} /> */}
      </div>
    </div>
  );
};

export default AddUTRTable;
