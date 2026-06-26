import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ptg-theme') || 'light';
  });

  useEffect(() => {
    // Remove all theme classes first
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-heritage', 'theme-baisakhi');
    
    // Apply selected theme class
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('ptg-theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (['light', 'dark', 'heritage', 'baisakhi'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
