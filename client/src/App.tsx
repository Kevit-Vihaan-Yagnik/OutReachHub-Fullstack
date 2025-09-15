import { createContext, useState } from 'react';
import { Provider } from 'react-redux';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { Router } from './app/router';
import { store } from './app/store';

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
        <Provider store={store}>
          <CssBaseline />
          <Router />
        </Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
