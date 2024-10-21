//frontend\src\theme.tsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#16A085', // Verde-azulado
    },
    secondary: {
      main: '#ECF0F1', // Branco gelo
    },
    success: {
      main: '#27AE60', // Verde suave
    },
    error: {
      main: '#E67E22', // Coral para mensagens de atenção
    },
    background: {
      default: '#F8F5F2', // Bege claro para o fundo
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Tipografia principal
    h1: {
      fontSize: '2.5rem', // Tamanho para títulos grandes
      fontWeight: 700, // Negrito para maior destaque
    },
    h2: {
      fontSize: '2rem', // Tamanho para subtítulos
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem', // Tamanho padrão para textos
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem', // Tamanho para textos menores
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none', // Desativa as letras maiúsculas automáticas nos botões
    },
  },
});

export default theme;
