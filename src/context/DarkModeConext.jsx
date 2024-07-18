import { createContext, useState } from "react";

export const DarkModeConext = createContext();

function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  return (
    <DarkModeConext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeConext.Provider>
  );
}

export default DarkModeProvider;
