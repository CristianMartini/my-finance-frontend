import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Typography, Link, Box } from '@mui/material';
import './styles.css';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormInputs) => void;
  errorMessage?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, errorMessage }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
  const onSubmitForm: SubmitHandler<RegisterFormInputs> = data => {
    onSubmit(data);
  };

  const password = watch('password');

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} className="register-form" noValidate>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Criar Conta
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <TextField
        margin="normal"
        fullWidth
        label="Nome"
        autoComplete="name"
        autoFocus
        {...register('name', { required: 'O nome é obrigatório' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Email"
        autoComplete="email"
        {...register('email', { required: 'O email é obrigatório' })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Senha"
        type="password"
        autoComplete="new-password"
        {...register('password', { required: 'A senha é obrigatória', minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' } })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Confirmar Senha"
        type="password"
        autoComplete="new-password"
        {...register('confirmPassword', {
          required: 'Confirmação de senha é obrigatória',
          validate: value => value === password || 'As senhas não correspondem'
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button type="submit" fullWidth variant="contained" color="primary" className="submit-button">
        Registrar
      </Button>
      <Box mt={2} textAlign="center">
        <Link href="/login" variant="body2">
          Já tem uma conta? Faça login
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterForm;
