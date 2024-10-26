/* eslint-disable react/prop-types */
import React from 'react';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import TableBody from '../../../components/Table/TableBody';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import UserNameCell from '../../KYC/components/UserNameCell';
import { useSelector } from 'react-redux';
import { useGetAllBattles } from '../hooks/useGetAllBattles';
import { formatDate } from '../../../utils/Search/convertDate';
import { DateWithTimeFormater } from '../../../utils/Search/DateWithTimeFormater';
import GameEditCell from '../../Manage-Game/components/GameEditCell';
import EndGameEditCell from './EndGameEditCell';

const EndedBattle = () => {
  const getSchema = () => {
    const columns = [
      {
        Header: `Game ID`,
        accessor: 'id',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.id ? row.original.id : 'Not Available'} />
        ),
      },
      {
        Header: `Start Time`,
        accessor: 'created_at',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.created_at ? DateWithTimeFormater( row.original.created_at) : 'Not Available'} />
        ),
      },
      {
        Header: `End Time`,
        accessor: 'completed_at',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.completed_at ? DateWithTimeFormater( row.original.completed_at) : 'Not Available'} />
        ),
      },

      {
        Header: `Room Code`,
        accessor: 'room_code',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.room_code ? row.original.room_code : 'Not Available'} />
        ),
      },

      {
        Header: `Winner`,
        accessor: 'winner',
        Cell: ({ row }) => (
          <UserNameCell value={row.original.winner ? row.original.winner : 'Not Available'} />
        ),
      },
      {
        Header: `Losser`,
        accessor: 'losser',
        Cell: ({ row }) => (
          <UserNameCell value={row.original.losser ? row.original.losser : 'Not Available'} />
        ),
      },

      {
        Header: `Entry Fee`,
        accessor: 'entry_fee',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.entry_fee ? row.original.entry_fee : 'Not Available'}
          />
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
        Header: `Actions`,
        Cell: ({ row }) => <EndGameEditCell row={row} isEndBattle={true} />,
      },
    ];
    return columns;
  };

  const column = getSchema();

  const { loading } =   useGetAllBattles()

  const battleState = (state) => state.battle;

  const { endedbattles } = useSelector(battleState);
   // Reverse the array before rendering
   const reversedBattles = [...endedbattles].reverse();
  return (
    <div>
      <div className="w-full py-3 mb-2 border-0 rounded-md bg-secondary lg:py-7">
        {loading ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : endedbattles.length === 0 ? (
          <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
            No Data Available
          </div>
        ) : (
          <TableBody columns={column} data={reversedBattles} isViewData={true} />
        )}
        {/* <TableBody columns={column} data={data} /> */}
      </div>
      {/* <TableBody columns={column} data={data} isViewData={true} /> */}
    </div>
  );
};

export default EndedBattle;
