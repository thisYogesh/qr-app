import React from "react";
import App from "../components/app";
import { Provider } from "react-redux";
import { store } from "./store";
import AppContextProvider, { RENDER_MODE } from "./app-context";

// web components
import "../components/web/placeholder";
import "../components/web/media";
import Customizer from "../components/customizer";

export default function Main({ renderMode }) {
  return (
    <Provider store={store}>
      <AppContextProvider renderMode={renderMode}>
        {renderMode !== RENDER_MODE.CUSTOMIZER ? (
          <App />
        ) : (
          <Customizer>
            <App />
          </Customizer>
        )}
      </AppContextProvider>
    </Provider>
  );
}
