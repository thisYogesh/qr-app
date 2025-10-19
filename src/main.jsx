import React from "react";
import App from "./app";
import { Provider } from "react-redux";
import { store } from "./store";
import AppContextProvider from "./app-context";

import "../components/web/placeholder";
import "../components/media";

export default function Main() {
  return (
    <Provider store={store}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Provider>
  );
}
