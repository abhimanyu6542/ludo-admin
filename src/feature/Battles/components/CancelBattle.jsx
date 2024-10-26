/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import TableBody from '../../../components/Table/TableBody';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import UserNameCell from '../../KYC/components/UserNameCell';
import { useSelector } from 'react-redux';
import { DateWithTimeFormater } from '../../../utils/Search/DateWithTimeFormater';
import EndGameEditCell from './EndGameEditCell';
import useGetCancelResponseBattle from '../hooks/useGetCancelResponseBattle';

const CancelBattle = () => {
  const getSchema = () => {
    const columns = [
      {
        Header: `Game ID`,
        accessor: 'id',
        Cell: ({ row }) => (
          <GenericTextCell value={row?.original?.id ? row?.original?.id : 'Not Available'} />
        ),
      },
      {
        Header: `Start Time`,
        accessor: 'created_at',
        Cell: ({ row }) => (
          <GenericTextCell
            value={
              row?.original?.created_at
                ? DateWithTimeFormater(row?.original?.created_at)
                : 'Not Available'
            }
          />
        ),
      },
      {
        Header: `End Time`,
        accessor: 'completed_at',
        Cell: ({ row }) => (
          <GenericTextCell
            value={
              row?.original?.completed_at
                ? DateWithTimeFormater(row?.original?.completed_at)
                : 'Not Available'
            }
          />
        ),
      },

      {
        Header: `Room Code`,
        accessor: 'room_code',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row?.original?.room_code ? row?.original?.room_code : 'Not Available'}
          />
        ),
      },

      {
        Header: `Creator`,
        accessor: 'created_by',
        Cell: ({ row }) => (
          <UserNameCell
            value={row?.original?.created_by ? row?.original?.created_by : 'Not Available'}
          />
        ),
      },
      {
        Header: `Player`,
        accessor: 'accepted_by',
        Cell: ({ row }) => (
          <UserNameCell
            value={row?.original?.accepted_by ? row?.original?.accepted_by : 'Not Available'}
          />
        ),
      },

      {
        Header: `Entry Fee`,
        accessor: 'entry_fee',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row?.original?.entry_fee ? row?.original?.entry_fee : 'Not Available'}
          />
        ),
      },
      {
        Header: `Prize`,
        accessor: 'prize',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row?.original?.prize ? row?.original?.entry_fee : 'Not Available'}
          />
        ),
      },
      {
        Header: `Actions`,
        Cell: ({ row }) => <EndGameEditCell row={row} />,
      },
    ];
    return columns;
  };

  const column = getSchema();


  const battleState = (state) => state.battle;

  const { cancelBattleResponseIds } = useSelector(battleState);
  const filters = useMemo(() => {
    return {
      cancelBattleResponseIds: cancelBattleResponseIds,
    };
  }, [cancelBattleResponseIds]);
  const cancelBattleResponse = useGetCancelResponseBattle(filters.cancelBattleResponseIds);
  return (
    <div>
      <div className="w-full py-3 mb-2 border-0 rounded-md bg-secondary lg:py-7">
        {cancelBattleResponse?.isLoading ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : cancelBattleResponse?.data?.data?.length === 0 ? (
          <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
            No Data Available
          </div>
        ) : (
          <TableBody columns={column} data={cancelBattleResponse?.data?.data} isViewData={true} />
        )}
      </div>
    </div>
  );
};

export default CancelBattle;
