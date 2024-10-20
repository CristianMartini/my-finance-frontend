// src/App.tsx


import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import AppRoutes from './routes';
import theme from './theme';
import './index.css'; // Importando os estilos globai

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
