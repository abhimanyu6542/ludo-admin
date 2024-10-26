import React from 'react'
import TableBody from '../../../../components/Table/TableBody';
import GenericTextCell from '../../../../components/Table/GenericTextCell';
import TxnStatusCell from './TxnStatusCell';
import BasicSpinner from '../../../../components/Spinner/BasicSpinner';
import useGetTransactionRequest from '../../hooks/useGetTransactionRequest';
import { formatDate } from '../../../../utils/Search/convertDate';
import { useSelector } from 'react-redux';


const TransactionHistory = () => {
  const user_number = useSelector((state) => state.user.user_number);


  const getSchema = () => {
    const columns = [
      {
        Header: `Created at`,
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
          <GenericTextCell
            value={row.original.amount ? row.original.amount : 'Not Available'}
          />
        ),
      },
      {
        Header: `Transaction request Id`,
        accessor: 'transaction_request_id',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.transaction_request_id ? row.original.transaction_request_id : 'Not Available'}
          />
        ),
      },
      {
        Header: `Closing balance`,
        accessor: 'closing_balance',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.closing_balance ? row.original.closing_balance : 'Not Available'}
          />
        ),
      },
      {
        Header: `Status`,
        accessor: 'transaction_type',
        Cell: ({ row }) => (
          <TxnStatusCell value={row.original.transaction_type ? row.original.transaction_type : 'Not Available'} />
        ),
      },
    ];
    return columns;
  }; 

  const transactionData = useGetTransactionRequest(parseInt(user_number));
  // console.log('transactionData -> ', transactionData?.data?.data);
  const column = getSchema();
  return (
    <div>
      {
        (transactionData.isFetching || transactionData.isLoading)
          ? <div className='flex justify-center w-full my-10'> <BasicSpinner /> </div>
          : transactionData.data.data.length === 0 ? (
            <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
              No Data Available
            </div>
          ) : <TableBody columns={column} data={transactionData?.data?.data} isViewData={true} />
      }
    </div>
  )
}

export default TransactionHistory