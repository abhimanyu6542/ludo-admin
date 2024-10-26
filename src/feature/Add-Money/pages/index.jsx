/* eslint-disable react/prop-types */
import React from 'react';
import TableBody from '../../../components/Table/TableBody';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import { formatDate } from '../../../utils/Search/convertDate';
import AddMoneyEditCell from '../components/AddMoneyEditCell';
import { useGetAllAddMoneyRequest } from '../hooks/useGetAllAddMoneyRequest';
import { useSelector } from 'react-redux';
import TxnStatusCell from '../components/TxnStatusCell';

const addMoneyState = (state) => state.add_money;
function AddMoneyPage() {

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
                    <TxnStatusCell value={row.original.status ? row.original.status : 'N/A'} />
                ),
            },
            {
                Header: `Actions`,
                Cell: ({ row }) => <AddMoneyEditCell data={row.original} />,
            },
        ];
        return columns;
    };

    const {loading} = useGetAllAddMoneyRequest()
  

    const { add_money_data } = useSelector(addMoneyState);
    const column = getSchema();

// Create a new sorted array to avoid mutating the original array
const sortedData = [...add_money_data].sort((a, b) => {
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
            <h1 className="mb-10 text-2xl font-medium font-poppins">Live Add Money Request</h1>

            {/* -- table displaying section */}
            {
                loading ? (
                    <div className="flex items-center justify-center w-full my-20">
                        {' '}
                        <BasicSpinner />{' '}
                    </div>
                ) : add_money_data.length === 0 ? (
                    <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
                        No Data Available
                    </div>
                ) : (
                   <div className='mb-5 pb-5'>
                     <TableBody columns={column} data={sortedData} />
                   </div>
                )
            }
        </div>
    )
}

export default AddMoneyPage