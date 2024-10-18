// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul padrão do Material-UI
    },
    secondary: {
      main: '#dc004e', // Rosa padrão do Material-UI
    },
    success: {
      main: '#4caf50', // Verde para sucesso
    },
    error: {
      main: '#f44336', // Vermelho para erros
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
