import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedWatchingType: "",
  selectedCountry: "",
  newSeriesData: null,
  editedSeriesData: null,
  refreshData: false,
  clearFilter: false,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    replaceClubsList(state, action) {
      if (action.payload !== null) {
        state.clubsList = action.payload;
      }
    },
    setSelectedWatchingType(state, action) {
      state.selectedWatchingType = action.payload;
    },
    setSelectedCountry(state, action) {
      state.selectedCountry = action.payload;
    },
    setNewSeriesData(state, action) {
      state.newSeriesData = action.payload;
    },
    setEditedSeriesData(state, action) {
      state.editedSeriesData = action.payload;
    },
    setRefreshData(state, action) {
      state.refreshData = action.payload;
    },
    setClearFilter(state, action) {
      state.clearFilter = action.payload;
    },
  },
});

export const appStateActions = appStateSlice.actions;

export default appStateSlice.reducer;
