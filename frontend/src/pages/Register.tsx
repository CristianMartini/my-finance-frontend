// src/pages/Register.tsx

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, TextField, Button, Typography } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await api.post('/auth/register', data);
      navigate('/login');
    } catch (err) {
      setError('Erro ao registrar usuário');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Registrar
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          {...register('name', { required: true })}
        />
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
          Registrar
        </Button>
      </form>
    </Container>
  );
};

export default Register;
