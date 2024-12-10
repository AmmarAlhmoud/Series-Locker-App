import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./app-state-slice";

const store = configureStore({
  reducer: {
    appState: appStateSlice,
  },
});

export default store;
