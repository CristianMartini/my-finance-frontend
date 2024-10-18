import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import { Container, Paper, Typography } from '@mui/material';
import './Login.css';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleLogin = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      setErrorMessage('Email ou senha inválidos');
    }
  };

  return (
    <div className="login-page">
      <Container maxWidth="sm">
        <Paper elevation={3} className="login-card">
          <Typography variant="h4" className="login-title">
            Entrar na sua conta
          </Typography>
          <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} />
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
