import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../theme/theme";

type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved === "dark") setTheme(darkTheme);
      } catch (e) {
        console.warn("Error loading theme:", e);
      } finally {
        setReady(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme.mode === "light" ? darkTheme : lightTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme.mode);
  };

  if (!ready) return null;

  const isDark = theme.mode === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
