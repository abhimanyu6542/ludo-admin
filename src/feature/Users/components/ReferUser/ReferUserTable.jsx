/* eslint-disable react/prop-types */
import React from 'react'
import GenericTextCell from '../../../../components/Table/GenericTextCell';
import TableBody from '../../../../components/Table/TableBody';
import useGetReferredUserQuery from '../../hooks/useGetReferredUserQuery';
import { useSelector } from 'react-redux';
import BasicSpinner from '../../../../components/Spinner/BasicSpinner';
import { formatDate, getTime } from '../../../../utils/Search/convertDate';
import { calculateEarning } from '../../utils/calculateEarning';


const ReferUserTable = () => {
  const unique_code = useSelector((state) => state.user.unique_code);

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
        Header: `Time`,
        accessor: 'unique_code',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.created_at ? getTime(row.original.created_at) : 'Not Available'}
          />
        ),
      },
      {
        Header: `User name`,
        accessor: 'user_name',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.user_name ? row.original.user_name : 'Not Available'}
          />
        ),
      },
      {
        Header: `Number`,
        accessor: 'phone',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.phone ? row.original.phone : 'Not Available'}
          />
        ),
      },
      {
        Header: `Earnings`,
        accessor: 'wallet',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.wallet ? calculateEarning(row.original.wallet.balance, row.original.wallet.total_amount_withdrawn, row.original.wallet.total_amount_recharged ) : 'Not Available'}
          />
        ),
      },
    ];
    return columns;
  };

  const referredDAta = useGetReferredUserQuery(unique_code);
  const column = getSchema();

  return (
    <div>
      {
        (referredDAta.isFetching || referredDAta.isLoading)
          ? <div className='flex justify-center w-full my-10'> <BasicSpinner /> </div>
          : referredDAta.data.data.length === 0 ? (
            <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
              No Data Available
            </div>
          ): <TableBody columns={column} data={referredDAta?.data?.data} isViewData={true} />
      }
    </div>
  )
}

export default ReferUserTable