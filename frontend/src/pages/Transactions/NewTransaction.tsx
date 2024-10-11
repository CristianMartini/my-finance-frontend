import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Typography, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface TransactionFormInputs {
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const NewTransaction: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TransactionFormInputs> = async data => {
    try {
      // Chame a API para criar a transação
      // Exemplo:
      // await api.post('/transactions', data);
      navigate('/transactions');
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" gutterBottom>
        Nova Transação
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Descrição"
        {...register('description', { required: 'A descrição é obrigatória' })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Valor"
        type="number"
        {...register('amount', { required: 'O valor é obrigatório', valueAsNumber: true })}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Data"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register('date', { required: 'A data é obrigatória' })}
        error={!!errors.date}
        helperText={errors.date?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Tipo"
        select
        {...register('type', { required: 'O tipo é obrigatório' })}
        error={!!errors.type}
        helperText={errors.type?.message}
      >
        <MenuItem value="income">Receita</MenuItem>
        <MenuItem value="expense">Despesa</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Salvar
      </Button>
    </Box>
  );
};

export default NewTransaction;
