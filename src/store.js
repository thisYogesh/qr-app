import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../states/app";

export const store = configureStore({
  reducer: {
    app: appReducer
  }
});
