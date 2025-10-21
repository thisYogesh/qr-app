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
  const [state, setState] = useState({
    renderMode,

    // props for custimizer
    highlightedCustomizeId: "",
    selectedCustomizeId: ""
  });

  const setContext = props => {
    setState(prev => ({ ...prev, ...props }));
  };

  return (
    <AppContext.Provider value={{ state, setContext }}>
      {children}
    </AppContext.Provider>
  );
}
