import { createContext, useState } from "react";

// Create Context
// eslint-disable-next-line react-refresh/only-export-components
export const DesignContext = createContext();

// Create Provider
export const DesignProvider = ({ children }) => {
  const [room, setRoom] = useState({
    shape: "",
    width: "",
    height: "",
    lWidth: "",   // extra for L
    lHeight: "",  // extra for L
    color: "",
  });

  return (
    <DesignContext.Provider value={{ room, setRoom }}>
      {children}
    </DesignContext.Provider>
  );
};
