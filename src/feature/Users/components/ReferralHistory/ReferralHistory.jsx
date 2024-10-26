/* eslint-disable react/prop-types */
import React from 'react';
import GenericTextCell from '../../../../components/Table/GenericTextCell';
import TableBody from '../../../../components/Table/TableBody';
import { useSelector } from 'react-redux';
import useGetReferralHistoryQuery from '../../hooks/useGetReferralHistoryQuery';
import BasicSpinner from '../../../../components/Spinner/BasicSpinner';
import { formatDate, getTime } from '../../../../utils/Search/convertDate';
import { calculatePercentage } from '../../../../utils/Search/calculatePercentage';

const ReferralHistory = () => {
  const { unique_code }= useSelector((state) => state.user);

  const getSchema = () => {
    const columns = [
      {
        Header: `Date`,
        accessor: 'created_at',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.created_at ? formatDate(row.original.created_at) : 'Not Available'} />
        ),
      },
      {
        Header: `Time`,
        accessor: 'winner',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.created_at ? getTime(row.original.created_at) : 'Not Available'} />
        ),
      },
      {
        Header: `User name`,
        accessor: 'created_by',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.created_by ? row.original.created_by : 'Not Available'} />
        ),
      },
      {
        Header: `Versus`,
        accessor: 'accepted_by',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.accepted_by ? row.original.accepted_by : 'Not Available'} />
        ),
      },
      {
        Header: `Play Amount`,
        accessor: 'prize',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.prize ? row.original.prize : 'Not Available'}
          />
        ),
      },
      {
        Header: `Your (2%)`,
        accessor: 'entry_fee',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.entry_fee ? calculatePercentage(row.original.entry_fee, 2) : 'Not Available'} />
        ),
      },
    ];
    return columns;
  };

const referral_data = useGetReferralHistoryQuery(unique_code);
  const column = getSchema();
  return (
    <div>
      {
        (referral_data.isFetching || referral_data.isLoading)
          ? <div className='w-full flex justify-center my-10'> <BasicSpinner /> </div>
          : referral_data.data.data.length === 0 ? (
            <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
              No Data Available
            </div>
          ): <TableBody columns={column} data={referral_data?.data?.data} isViewData={true} />
      }
    </div>
  );
};

export default ReferralHistory;
