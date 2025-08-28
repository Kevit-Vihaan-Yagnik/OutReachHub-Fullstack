import { useState, createContext } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Router } from './app/router';

interface ThemeContextType {
  mode: 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const App = () => {
  const [mode] = useState<'dark'>('dark'); // Fixed to dark mode

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
          primary: {
            main: '#90caf9',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
          },
        }
        : {}),
    },
  });


  return (
    <ThemeContext.Provider value={{ mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;