// src/pages/Transactions/Index.tsx

import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import TransactionTable from '../../components/TransactionTable';
import TransactionFilters from '../../components/TransactionFilters';
import ConfirmDialog from '../../components/ConfirmDialog';
import Statistics from '../../components/Statistics';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar transações.');
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    navigate('/transactions/new');
  };

  const handleEdit = (transaction: Transaction) => {
    navigate(`/transactions/edit/${transaction.id}`);
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await api.delete(`/transactions/${transactionToDelete.id}`);
      setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
      setFilteredTransactions(filteredTransactions.filter(t => t.id !== transactionToDelete.id));
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (err) {
      setError('Erro ao excluir transação.');
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  // Dentro de src/pages/Transactions/Index.tsx

const handleFilter = (filters: { type: 'all' | 'income' | 'expense'; startDate?: string; endDate?: string }) => {
  let filtered = [...transactions];

  if (filters.type !== 'all') {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filtered = filtered.filter(t => new Date(t.date) >= startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filtered = filtered.filter(t => new Date(t.date) <= endDate);
  }

  setFilteredTransactions(filtered);
};


  // Calculando totais para estatísticas
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Transações
      </Typography>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddTransaction}>
        Nova Transação
      </Button>
      <TransactionFilters onFilter={handleFilter} />
      <Statistics totalIncome={totalIncome} totalExpense={totalExpense} />
      {error && <Typography color="error" mt={2}>{error}</Typography>}
      <TransactionTable transactions={filteredTransactions} onEdit={handleEdit} onDelete={handleDelete} />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        content={`Deseja realmente excluir a transação "${transactionToDelete?.description}"?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      {/* Notificações de Erro */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Transactions;
