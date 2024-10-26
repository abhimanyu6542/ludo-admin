import React from 'react'
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import TableBody from '../../../components/Table/TableBody';
import { useSelector } from 'react-redux';
import { useGetAllWithdrawalRequest } from '../../withdrawl/hooks/useGetAllWithdrawalRequest';
import WithdrawalEditCell from '../../withdrawl/components/WithdrawalEditCell';
import TxnStatusCell from '../../Add-Money/components/TxnStatusCell';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import { formatDate } from '../../../utils/Search/convertDate';


const withdrawalState = (state) => state.withdrawal;
const Withdrawals = () => {
    const getSchema = () => {
        const columns = [
            {
                Header: `User ID`,
                accessor: 'user_id',
                Cell: ({ row }) => (
                    <GenericTextCell
                        value={row.original.user_id ? row.original.user_id : 'Not Available'}
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
                accessor: 'status',
                Cell: ({ row }) => (
                    <TxnStatusCell value={row.original.status ? row.original.status : 'Pending'} />
                ),
            },
            {
                Header: `Actions`,
                Cell: ({ row }) => <WithdrawalEditCell row={row.original} />,
            },
        ];
        return columns;
    };

    const {loading} = useGetAllWithdrawalRequest()
   

    const { new_withdrawal } = useSelector(withdrawalState);
    const column = getSchema();

    
// Create a new sorted array to avoid mutating the original array
const sortedData = [...new_withdrawal].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') {
        return -1;
    }
    if (a.status !== 'pending' && b.status === 'pending') {
        return 1;
    }
    return 0;
});
  return (
    <div>
        <div>

            {/* -- table displaying section */}
            {
                loading ? (
                    <div className="flex items-center justify-center w-full my-20">
                        {' '}
                        <BasicSpinner />{' '}
                    </div>
                ) : new_withdrawal.length === 0 ? (
                    <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
                        No Data Available
                    </div>
                ) : (
                    <div className='mb-5 pb-5'>
                     <TableBody columns={column} data={sortedData} isFromNotification={true} />
                   </div>
                )
            }
        </div>
    </div>
  )
}

export default Withdrawals