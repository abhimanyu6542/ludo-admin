/* eslint-disable react/prop-types */
import React from 'react';
import BattleStatusCell from './BattleStatusCell';
import GenericTextCell from '../../../../components/Table/GenericTextCell';
import TableBody from '../../../../components/Table/TableBody';
import BasicSpinner from '../../../../components/Spinner/BasicSpinner';
import { formatDate, getTime } from '../../../../utils/Search/convertDate';
import useGetBattleHistoryQuery from '../../hooks/useGetBattleHistoryQuery';
import VersusCell from './VersusCell';
import { useSelector } from 'react-redux';


const BattleHistory = () => {
  const user_name = useSelector((state) => state.user.user_name);

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
        accessor: 'winner',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.created_at ? getTime(row.original.created_at) : 'Not Available'} />
        ),
      },

      {
        Header: `Versus`,
        accessor: 'accepted_by',
        Cell: ({ row }) => (
          <VersusCell value={row.original ?user_name == row.original.accepted_by? row.original.created_by:row.original.accepted_by  : 'Not Available'} />
        ),
      },
      {
        Header: `Prize`,
        accessor: 'prize',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.prize ? row.original.prize : 'Not Available'} />
        ),
      },
      {
        Header: `Status`,
        accessor: 'battle_status',
        Cell: ({ row }) => (
          <BattleStatusCell value={row.original.battle_status ? row.original.battle_status : 'Not Available'} />
        ),
      },
    ];
    return columns;
  };

  const battleData = useGetBattleHistoryQuery(user_name);
  const column = getSchema();

  return (
    <div>
      {
        (battleData.isFetching || battleData.isLoading)
          ? <div className='w-full flex justify-center my-10'> <BasicSpinner /> </div>
          : battleData.data.data.length === 0 ? (
            <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
              No Data Available
            </div>
          ): <TableBody columns={column} data={battleData?.data?.data} isViewData={true} />
      }
    </div>
  );
};

export default BattleHistory;
