'use client';

import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { createContext, use, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from './index';

type ColorMode = 'light' | 'dark';

type ThemeContextProps = {
  mode: ColorMode;
  toggleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleColorMode: () => {},
});

export const useThemeMode = () => use(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ColorMode>('light');

  const toggleColorMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext>
  );
};
