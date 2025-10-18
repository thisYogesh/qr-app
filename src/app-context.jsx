import React, { createContext, useState } from "react";
export const AppContext = createContext();

const MODE = {
  NORMAL: "1",
  CUSTOMIZER: "2"
};

export default function AppContextProvider({ children }) {
  const [state] = useState({});
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}
