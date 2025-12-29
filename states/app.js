import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import {
  addPaths,
  getDynamicState,
  pushUpdateAtPath,
  updateAtPath
} from "../src/utils";
import { getSettings } from "../src/helpers";

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
    configInFetch: false,

    // settings to show in configuration panel
    currentSettings: null,
    currentSettingPath: "",

    currentNewConfig: null
  },
  reducers: {
    setConfig: (state, config) => {
      state.storeConfig = config.payload;
    },

    setConfigFetchStatus: (state, configInFetch) => {
      state.configInFetch = configInFetch.payload;
    },

    setSettings: (state, settings) => {
      state.currentSettings = settings.payload;
    },

    setSettingPath: (state, settings) => {
      state.currentSettingPath = settings.payload;
    },

    setNewConfig: (state, settings) => {
      state.currentNewConfig = settings.payload;
    },

    // TODO: see if there is any other way to update state
    updateStoreConfig: (state, data) => {
      const currentState = current(state);
      const { storeConfig, currentSettingPath } = currentState;
      const cloneState = window.structuredClone(storeConfig);
      const { __path, value } = data.payload;
      const newConfig = updateAtPath(cloneState, __path, value);

      state.storeConfig = {
        ...state.storeConfig,
        ...newConfig
      };

      const currentSettings = getDynamicState(cloneState, currentSettingPath);
      const settings = getSettings([currentSettings]);
      state.currentSettings = {
        ...state.currentSettings,
        ...settings?.[0]
      };
    },

    addNewConfig: (state, action) => {
      const { newConfig, newConfigMeta } = action.payload;
      const { initialPath, newPath } = newConfigMeta;
      const config = addPaths(newConfig, newPath);
      const { storeConfig } = state;

      // update the state
      pushUpdateAtPath(storeConfig, initialPath, config);
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      if (action.payload) {
        const storeConfig = getMatchedConfig(action.payload);
        state.storeConfig = addPaths(storeConfig);
      }
      state.configInFetch = false;
    });
  }
});

export const {
  setConfig,
  setConfigFetchStatus,
  setSettings,
  setNewConfig,
  updateStoreConfig,
  setSettingPath,
  addNewConfig
} = appReducer.actions;
export default appReducer.reducer;
