// src/pages/Login.tsx

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Entrar
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register('email', { required: true })}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          {...register('password', { required: true })}
        />
        <Button type="submit" variant="contained" color="primary">
          Entrar
        </Button>
      </form>
    </Container>
  );
};

export default Login;
