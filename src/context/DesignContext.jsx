import { createContext, useState } from "react";

const DesignContext = createContext();
export { DesignContext };

export const DesignProvider = ({ children }) => {
  const [room, setRoom] = useState({
    shape: "",
    width: "",
    height: "",
    lWidth: "",
    lHeight: "",
    color: "",
  });

  // 🔥 ADD THIS
  const [objects, setObjects] = useState([]);

  return (
    <DesignContext.Provider
      value={{
        room,
        setRoom,
        objects,
        setObjects,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};