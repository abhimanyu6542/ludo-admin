import React from 'react';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import TableBody from '../../../components/Table/TableBody';
import { DateWithTimeFormater } from '../../../utils/Search/DateWithTimeFormater';
import { useSelector } from 'react-redux';
import { useGetAllBattles } from '../../Battles/hooks/useGetAllBattles';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import GameEditCell from '../../Manage-Game/components/GameEditCell';

const battleState = (state) => state.battle;
const Battles = () => {
  const getSchema = () => {
    const columns = [
      {
        Header: `Game ID`,
        accessor: 'id',
        Cell: ({ row }) => <GenericTextCell value={row.original.id ? row.original.id : 'N/A'} />,
      },
      {
        Header: `Start Time`,
        accessor: 'created_at',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.created_at ? DateWithTimeFormater(row.original.created_at) : 'N/A'}
          />
        ),
      },
      {
        Header: `Creator`,
        accessor: 'created_by',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.created_by ? row.original.created_by : 'N/A'} />
        ),
      },
      {
        Header: `Player`,
        accessor: 'accepted_by',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.accepted_by ? row.original.accepted_by : 'N/A'} />
        ),
      },

      {
        Header: `Staus`,
        accessor: 'battle_status',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.battle_status ? row.original.battle_status : 'N/A'}
          />
        ),
      },

      {
        Header: `Entry Fee`,
        accessor: 'entry_fee',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.entry_fee ? row.original.entry_fee : 'N/A'} />
        ),
      },
      {
        Header: `Prize`,
        accessor: 'prize',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.prize ? row.original.prize : 'N/A'} />
        ),
      },
      {
        Header: `Actions`,
        Cell: ({ row }) => <GameEditCell row={row} />,
      },
    ];
    return columns;
  };


  const { newCreatedBattles } = useSelector(battleState);
  const column = getSchema();
  const { loading } = useGetAllBattles();
console.log(newCreatedBattles, 'newCreatedBattles')
// Ensure that the array length doesn't exceed 5
// Ensure the array contains only the first 5 objects
const limitedBattles = newCreatedBattles.slice(0, 7);
  return (
    <div>
      <div className="w-full py-3 mb-2 border-0 rounded-md bg-secondary lg:py-7">
        {loading ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : newCreatedBattles?.length === 0 ? (
          <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
            No Data Available
          </div>
        ) : (
          <TableBody columns={column} data={limitedBattles} isViewData={true} isFromNotification={true} />
        )}
      </div>
    </div>
  );
};

export default Battles;
