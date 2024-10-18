// src/pages/Transactions/EditTransaction.tsx

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import TransactionForm from '../../components/TransactionForm';
import { TransactionFormInputs } from '../../types';
import { SubmitHandler } from 'react-hook-form';
import api from '../../services/api';

const EditTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<TransactionFormInputs | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) {
        setErrorMessage('ID de transação inválido.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/transactions/${id}`);
        const transaction = response.data;

        setInitialData({
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date.slice(0, 10), // Ajustar formato da data
          category: transaction.category,
          subCategory: transaction.subCategory,
          type: transaction.type,
          source: transaction.source,
          isParcelado: transaction.isParcelado,
          parcelas: transaction.parcelas,
          notes: transaction.notes,
        });

        setLoading(false);
      } catch (error: any) {
        setErrorMessage('Erro ao carregar transação.');
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleSubmit: SubmitHandler<TransactionFormInputs> = async (data) => {
    if (!id) {
      setErrorMessage('ID de transação inválido.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await api.put(`/transactions/${id}`, data);

      setSuccessMessage('Transação atualizada com sucesso!');
      setLoading(false);
      navigate('/transactions');
    } catch (error: any) {
      setErrorMessage('Erro ao atualizar transação.');
      setLoading(false);
    }
  };

  return (
    <div>
     
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
      {!loading && initialData && (
        <TransactionForm
          onSubmit={handleSubmit}
          initialData={initialData}
          mode="edit"
        />
      )}
      {/* Notificações de Sucesso */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      {/* Notificações de Erro */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditTransaction;
