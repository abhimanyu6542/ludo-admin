import React, { useState } from 'react';
import TableBody from '../../../components/Table/TableBody';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import { HiOutlinePlusSmall } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import useGetAllBattleQuery from '../hooks/useGetAllBattleQuery';
import UserNameCell from '../../KYC/components/UserNameCell';
import { DateWithTimeFormater } from '../../../utils/Search/DateWithTimeFormater';
import GameEditCell from '../components/GameEditCell';
import { useSelector } from 'react-redux';

const ManageGame = () => {
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
        Header: `End Time`,
        accessor: 'completed_at',
        Cell: ({ row }) => (
          <GenericTextCell
            value={
              row.original.completed_at ? DateWithTimeFormater(row.original.completed_at) : 'N/A'
            }
          />
        ),
      },

      {
        Header: `Room Code`,
        accessor: 'room_code',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.room_code ? row.original.room_code : 'N/A'} />
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
      //   {
      //     Header: `Prize`,
      //     accessor: 'prize',
      //     Cell: ({ row }) => (
      //       <GenericTextCell value={row.original.prize ? row.original.entry_fee : 'N/A'} />
      //     ),
      //   },
      {
        Header: `Actions`,
        Cell: ({ row }) => <GameEditCell row={row} />,
      },
    ];
    return columns;
  };

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const managedUser = useSelector((state) => state.user.managed_user) || [];

  const userNames = managedUser?.map((user) => user.user_name) || null;

  const gameData = useGetAllBattleQuery(userNames);
  // console.log('gameData -> ', gameData?.data?.data);
  const column = getSchema();

  const data = gameData?.data?.data || [];
  // Create a new sorted array to avoid mutating the original array
  const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return (
    <div>
      <div className="w-full px-2 py-3 mb-2 border-0 rounded-md bg-secondary lg:px-6 lg:py-7">
        <div className="flex items-center justify-between mb-3 w-[70%]">
          <h1 className="text-2xl font-bold font-poppins">Manage Game</h1>

          <div className="flex justify-end self-end">
            <button
              onClick={() => navigate('/manage-game/create')}
              className="px-5 py-2 border-2 flex justify-center  bg-[#065F46] text-[#FFFFFF] rounded-md"
            >
              {isLoading ? (
                <BasicSpinner />
              ) : (
                <div className="flex items-center gap-3">
                  {' '}
                  <HiOutlinePlusSmall className="w-6 h-6 text-white" /> Create Game{' '}
                </div>
              )}
            </button>
          </div>
        </div>
        {gameData.isLoading || gameData.isFetching ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : gameData?.data?.data?.length === 0 ? (
          <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
            No Data Available
          </div>
        ) : (
          <TableBody columns={column} data={sortedData} />
        )}
      </div>
    </div>
  );
};

export default ManageGame;
