import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getMatchedConfig = data => {
  const { items } = data;
  const url = new URL(window.location.href);
  const storeId = url.searchParams.get("store_id");

  const storeConfig = storeId?.trim()
    ? items.find(config => config.store_id === storeId)
    : items[0];

  return storeConfig;
};

export const fetchConfig = createAsyncThunk(
  "app/fetch-config",
  (_, thunkApi) => {
    const { configInFetch, storeConfig } = thunkApi.getState().app;
    if (configInFetch || storeConfig) return;

    return fetch("/manifest.json")
      .then(resp => resp.json())
      .then(json => json);
  }
);

const appReducer = createSlice({
  name: "app",
  initialState: {
    storeConfig: null,
    configInFetch: false
  },
  reducers: {
    setConfig: (state, config) => {
      state.storeConfig = config;
    },

    setConfigFetchStatus: (state, configInFetch) => {
      state.configInFetch = configInFetch;
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      if (action.payload) {
        const storeConfig = getMatchedConfig(action.payload);
        state.storeConfig = storeConfig;
      }
      state.configInFetch = false;
    });
  }
});

export const { setConfig, setConfigFetchStatus } = appReducer.actions;
export default appReducer.reducer;
