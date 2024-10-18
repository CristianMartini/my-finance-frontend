//frontend\src\components\LoginForm\index.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Typography, Link, Box, IconButton, InputAdornment } from '@mui/material';
import { Icon } from '@iconify/react'; // Usando Iconify para ícones
import './styles.css'; // Estilos personalizados

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void;
  errorMessage?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errorMessage }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitForm: SubmitHandler<LoginFormInputs> = data => {
    onSubmit(data);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} className="login-form" noValidate>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Bem-vindo
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      
      <TextField
        margin="normal"
        fullWidth
        label="Email"
        autoComplete="email"
        autoFocus
        {...register('email', { required: 'O email é obrigatório' })}
        error={!!errors.email}
        helperText={errors.email?.message}
        size="small" // Tamanho mais compacto
      />
      
      <TextField
        margin="normal"
        fullWidth
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        {...register('password', { required: 'A senha é obrigatória' })}
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <Icon icon="mdi:eye-off" /> : <Icon icon="mdi:eye" />} {/* Ícones do Iconify */}
              </IconButton>
            </InputAdornment>
          ),
        }}
        size="small" // Tamanho mais compacto
      />
      
      <Button type="submit" fullWidth variant="contained" color="primary" className="submit-button">
        Entrar
      </Button>
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<Icon icon="mdi:google" />} // Ícone do Google
        className="google-button"
        onClick={() => {/* Função para login com Google */}}
        sx={{ mt: 2 }}
      >
        Entrar com Google
      </Button>
      
      <Box mt={2} textAlign="center">
        <Link href="/register" variant="body2">
          Não tem uma conta? Registre-se
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
