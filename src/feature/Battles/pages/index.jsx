import React, { useMemo } from 'react';
import OngoingBattles from '../components/OngoingBattles';
import EndedBattle from '../components/EndedBattle';
import DisputedBattles from '../components/DisputedBattles';
import { useGetAllBattles } from '../hooks/useGetAllBattles';
import { useDispatch, useSelector } from 'react-redux';
import CancelBattle from '../components/CancelBattle';
import useGetCancelResponseBattle from '../hooks/useGetCancelResponseBattle';
import { setCurrentTab } from '../../../slice/auth.slice';

const BattleIndex = () => {
  const currentTab = useSelector((state) => state.auth.currentTab) || null;
  useGetAllBattles()
  const dispatch = useDispatch();
  const displayComponent = (num = 1) => {
    switch (num) {
      case 1:
        return <OngoingBattles />;
      case 2:
        return <EndedBattle />;
      case 3:
        return <DisputedBattles />;
      case 4:
        return <CancelBattle />;
    }
  };

  const battleState = (state) => state.battle;

  const { ongoingBattles, endedbattles, disputedBattles, cancelBattleResponseIds } = useSelector(battleState);
  const filters = useMemo(() => {
    return {
        cancelBattleResponseIds: cancelBattleResponseIds,
    };
  }, [cancelBattleResponseIds]);
  const cancelBattleResponse = useGetCancelResponseBattle(filters.cancelBattleResponseIds);
 
  return (
    <div>
      <div className="w-full px-2 py-3 mb-2 border-0 rounded-md bg-secondary lg:px-6">
        <h1 className=" font-medium text-2xl font-poppins mb-3 mr-6">Ongoing and ended battles</h1>
        <div className="border w-full"></div>
        <div className="flex items-center my-3 justify-evenly md:justify-normal">
          <button
            onClick={() => dispatch(setCurrentTab(1))}
            className={`md:mr-7 font-normal font-poppins text-xl pb-2  ${
              currentTab === 1
                ? 'text-[#065F46] border-b-2 border-[#065F46]'
                : 'text-[#9CA3AF]'
            }`}
          >
            Ongoing Battles ({ongoingBattles.length})
          </button>
          <button
            onClick={() => dispatch(setCurrentTab(2))}
            className={`md:mr-7 font-normal font-poppins text-xl pb-2  ${
              currentTab === 2
                ? 'text-[#065F46] border-b-2 border-[#065F46]'
                : 'text-[#9CA3AF]'
            }`}
          >
           Ended Battles ({endedbattles.length})
          </button>
          <button
            onClick={() => dispatch(setCurrentTab(3))}
            className={`md:mr-7 font-normal font-poppins text-xl pb-2  ${
              currentTab === 3
                ? 'text-[#065F46] border-b-2 border-[#065F46]'
                : 'text-[#9CA3AF]'
            }`}
          >
           Disputed Battles ({disputedBattles.length})
          </button>
          <button
            onClick={() => dispatch(setCurrentTab(4))}
            className={`md:mr-7 font-normal font-poppins text-xl pb-2  ${
              currentTab === 4
                ? 'text-[#065F46] border-b-2 border-[#065F46]'
                : 'text-[#9CA3AF]'
            }`}
          >
           Cancelled Response ({cancelBattleResponse?.data?.data?.length})
          </button>
        </div>

        <div>{displayComponent(currentTab)}</div>
      </div>
    </div>
  );
};

export default BattleIndex;
