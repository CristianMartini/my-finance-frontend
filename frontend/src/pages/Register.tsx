import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/RegisterForm';
import { Container } from '@mui/material';
import './Register.css';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormInputs) => {
    try {
      // Chame a API de registro do backend
      // Exemplo:
      // await api.post('/auth/register', data);
      // Após o registro bem-sucedido, redirecione para a página de login
      navigate('/login');
    } catch (error) {
      setErrorMessage('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="register-page">
      <Container maxWidth="sm">
        <RegisterForm onSubmit={handleRegister} errorMessage={errorMessage} />
      </Container>
    </div>
  );
};

export default Register;
