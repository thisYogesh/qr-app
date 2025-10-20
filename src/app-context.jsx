import React, { createContext, useState } from "react";

export const AppContext = createContext();
export const RENDER_MODE = {
  NORMAL: "1",
  CUSTOMIZER: "2"
};

export default function AppContextProvider({
  children,
  renderMode = RENDER_MODE.NORMAL
}) {
  const [state] = useState({ renderMode });
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}
