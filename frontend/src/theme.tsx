// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // Personalize seu tema aqui
  palette: {
    primary: {
      main: '#1976d2', // Azul padrão do Material-UI
    },
    secondary: {
      main: '#dc004e', // Rosa padrão do Material-UI
    },
  },
});

export default theme;
