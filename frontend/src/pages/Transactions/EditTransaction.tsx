// src/pages/Transactions/EditTransaction.tsx

import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import TransactionForm from '../../components/TransactionForm';

interface TransactionFormInputs {
  description: string;
  amount: number;
  date: string;
  category: 'income' | 'expense';
  subCategory: string;
  type: string;
  source: string;
  isParcelado: boolean;
  parcelas?: number;
  notes?: string;
}

const EditTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<TransactionFormInputs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = () => {
      if (!id) {
        setErrorMessage('ID de transação inválido.');
        setLoading(false);
        return;
      }

      try {
        // Recuperar transações do localStorage
        const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        
        // Encontrar a transação específica
        const transactionToEdit = existingTransactions.find((t: any) => t.id === parseInt(id));
        
        if (transactionToEdit) {
          setInitialData({
            description: transactionToEdit.description,
            amount: transactionToEdit.amount,
            date: transactionToEdit.date.split('T')[0], // Formatar data para input
            category: transactionToEdit.category,
            subCategory: transactionToEdit.subCategory,
            type: transactionToEdit.type,
            source: transactionToEdit.source,
            isParcelado: transactionToEdit.isParcelado,
            parcelas: transactionToEdit.isParcelado ? transactionToEdit.parcelas : undefined,
            notes: transactionToEdit.notes,
          });
        } else {
          setErrorMessage('Transação não encontrada.');
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage('Erro ao carregar transação.');
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleSubmit = (data: TransactionFormInputs) => {
    if (!id) {
      setErrorMessage('ID de transação inválido.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Recuperar transações existentes
      const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Atualizar a transação específica
      const updatedTransactions = existingTransactions.map((transaction: any) => 
        transaction.id === parseInt(id) ? { ...transaction, ...data } : transaction
      );
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      setSuccessMessage('Transação atualizada com sucesso!');
      setLoading(false);
      navigate('/transactions');
    } catch (error) {
      setErrorMessage('Erro ao atualizar transação.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Editar Transação
      </Typography>
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
      {!loading && initialData && (
        <TransactionForm onSubmit={handleSubmit} initialData={initialData} mode="edit" />
      )}
      {/* Notificações de Sucesso */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      {/* Notificações de Erro */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditTransaction;
