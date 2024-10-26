import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isInsertNewItem: false,
  isModalOpen: false,
  isNotificatinOn: true,
  newCreatedBattles: [],
  current_battles: [],
  ongoingBattles: [],
  endedbattles: [],
  disputedBattles: [],
  canceledBattles: [],
  cancelBattleResponse: [],
  cancelBattleResponseIds: [],
  allBattleResponse: [],
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setCanceledBattles(state, action) {
      state.canceledBattles = action.payload;
    },
    setIsNotificatinOn(state, action) {
      state.isNotificatinOn = action.payload;
    },
    setIsInsertNewItem(state, action) {
      state.isInsertNewItem = action.payload;
    },
    setCancelBattleResponse(state, action) {
      state.cancelBattleResponse = action.payload;
    },
    setIsModalOpen(state, action) {
      state.isModalOpen = action.payload;
    },
    setNewCreatedBattles(state, action) {
      state.newCreatedBattles = action.payload;
    },
    removeDeletedBattles(state, action) {
      if (state.newCreatedBattles.map((battle) => battle.id === action.payload)) {
        state.newCreatedBattles = [
          ...state.newCreatedBattles.filter((battle) => battle.id != action.payload),
        ].reverse();
      }
    },
    addNewCreatedBattles(state, action) {
      let newData = [...state.newCreatedBattles];
      newData.push(action.payload);
      state.newCreatedBattles = newData;
    },
    addCancelBattleResponse(state, action) {
      let newData = [...state.cancelBattleResponse];
      newData.push(action.payload);
      state.cancelBattleResponse = newData;
    },

    setCancelBattleResponseIds(state, action) {
      state.cancelBattleResponseIds = action.payload;
    },
    addCancelBattleResponseIds(state, action) {
      let newData = [...state.cancelBattleResponseIds];

      console.log(newData, 'inside slice newData array');
      const data = action.payload;
      console.log(data.battle_id, 'inside slice newData');
      // console.log(uniqueBattleIds, 'inside slice uniqueBattleIds');
      newData.push(data.battle_id);
      // // Convert the Set back to an array if needed
      const uniqueBattleIds = [...new Set(newData)];
      const uniqueBattleIdsArray = [...uniqueBattleIds];
      state.cancelBattleResponseIds = uniqueBattleIdsArray;
    },
    setOngoingBattles(state, action) {
      state.ongoingBattles = action.payload;
    },
    setAllBattleResponse(state, action) {
      state.allBattleResponse = action.payload;
    },
    addAllBattleResponse(state, action) {
      let newData = [...state.allBattleResponse];
      newData.push(action.payload);
      state.allBattleResponse = newData;
    },
    setCurrentBattles(state, action) {
      state.current_battles = action.payload;
    },

    setEndedBattles(state, action) {
      state.endedbattles = action.payload;
    },
    setDisputedBattles(state, action) {
      state.disputedBattles = action.payload;
    },

    addOngoingBattles(state, action) {
      state.ongoingBattles = [...state.ongoingBattles, action.payload].reverse();
    },
    addEndedBattles(state, action) {
      state.endedbattles = [...state.endedbattles, action.payload].reverse();
    },
    addDisputedBattles(state, action) {
      state.disputedBattles = [...state.disputedBattles, action.payload].reverse();
    },
    removeFromDisputedBattles(state, action) {
      if (state.disputedBattles.map((battle) => battle.id === action.payload)) {
        state.disputedBattles = [
          ...state.disputedBattles.filter((battle) => battle.id != action.payload),
        ].reverse();
      }
    },
    removeFromOngoingBattles(state, action) {
      if (state.ongoingBattles.map((battle) => battle.id === action.payload)) {
        state.ongoingBattles = [
          ...state.ongoingBattles.filter((battle) => battle.id != action.payload),
        ].reverse();
      }
    },
  },
});

export const {
  setOngoingBattles,
  addCancelBattleResponseIds,
  addCancelBattleResponse,
  setEndedBattles,
  setDisputedBattles,
  setCancelBattleResponseIds,
  addNewCreatedBattles,
  removeDeletedBattles,
  setNewCreatedBattles,
  setCanceledBattles,
  setCurrentBattles,
  setCancelBattleResponse,
  setAllBattleResponse,
  addAllBattleResponse,
  addOngoingBattles,
  addEndedBattles,
  setIsInsertNewItem,
  addDisputedBattles,
  removeFromDisputedBattles,
  removeFromOngoingBattles,
  setIsModalOpen,
  setIsNotificatinOn,
} = battleSlice.actions;
export default battleSlice.reducer;
