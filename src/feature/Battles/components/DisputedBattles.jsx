/* eslint-disable react/prop-types */
import React from 'react';
import PlayersCell from './PlayersCell';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import TableBody from '../../../components/Table/TableBody';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import DisputedEditCell from './DisputedEditCell';
import { useSelector } from 'react-redux';
import { useGetAllBattles } from '../hooks/useGetAllBattles';

const DisputedBattles = () => {
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
        Header: `Players`,
        accessor: 'created_by',
        Cell: ({ row }) => <PlayersCell value={row.original ? row.original : 'Not Available'} />,
      },
      {
        Header: `Room Code`,
        accessor: 'room_code',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.room_code ? row.original.room_code : 'Not Available'} />
        ),
      },

      {
        Header: `Amount`,
        accessor: 'entry_fee',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.entry_fee ? row.original.entry_fee : 'Not Available'}
          />
        ),
      },
      {
        Header: `Actions`,
        Cell: ({ row }) => <DisputedEditCell row={row} />,
      },
    ];
    return columns;
  };

  const column = getSchema();


  const { loading } =   useGetAllBattles()

  const battleState = (state) => state.battle;

  const { disputedBattles } = useSelector(battleState);
   // Reverse the array before rendering
   const reversedBattles = [...disputedBattles].reverse();
  return (
    <div>
      <div className="w-full py-3 mb-2 border-0 rounded-md bg-secondary lg:py-7">
        {loading? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : disputedBattles.length === 0 ? (
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

export default DisputedBattles;
