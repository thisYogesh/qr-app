import { createSlice } from "@reduxjs/toolkit";

const appReducer = createSlice({
  name: "app",
  initialState: { storeConfig: null },
  reducers: {
    setConfig: config => {
      state.storeConfig = config;
    }
  }
});

export const { setConfig } = appReducer.actions;
export default appReducer.reducer;
