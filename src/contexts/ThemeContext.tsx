import React, { useEffect, useState } from 'react';
import { ThemeContext, type Theme } from './themeContextDef';

export { type Theme, type ThemeContextType } from './themeContextDef';

const THEME_STORAGE_KEY = 'nihongo_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      // Se tiver 'dark' ou 'light' salvo, usa a preferência do usuário
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // Falha silenciosa no acesso ao storage
    }
    // Caso não exista preferência salva, padrão é 'light'
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignora erro no localStorage
    }

    const isDarkTheme = theme === 'dark';
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
