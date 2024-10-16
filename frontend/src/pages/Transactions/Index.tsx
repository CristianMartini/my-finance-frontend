// src/pages/Transactions/Index.tsx

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { Add, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../../components/TransactionTable';
import TransactionFilters from '../../components/TransactionFilters';
import ConfirmDialog from '../../components/ConfirmDialog';

interface Transaction {
  id: number;
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

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    try {
      // Simulando fetch do localStorage
      const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      setTransactions(storedTransactions);
      setFilteredTransactions(storedTransactions);
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

  const confirmDelete = () => {
    if (!transactionToDelete) return;
    try {
      const updatedTransactions = transactions.filter(t => t.id !== transactionToDelete.id);
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
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

  const handleFilter = (filters: {
    type: 'all' | 'income' | 'expense';
    startDate?: string;
    endDate?: string;
  }) => {
    let filtered = [...transactions];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.category === filters.type);
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
    .filter(t => t.category === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.category === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          p: 2,
          borderRadius: 1,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4">Transações</Typography>
      </Box>

      {/* Botão Nova Transação */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddTransaction}
        >
          Nova Transação
        </Button>
      </Box>

      {/* Estatísticas */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        mb={2}
      >
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#e0f2f1',
          }}
        >
          <TrendingUp color="success" sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6">Total de Receitas</Typography>
            <Typography variant="h5" color="success.main">
              R$ {totalIncome.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#ffebee',
          }}
        >
          <TrendingDown color="error" sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6">Total de Despesas</Typography>
            <Typography variant="h5" color="error.main">
              R$ {totalExpense.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      </Stack>

      {/* Filtros */}
      {!isMobile && <TransactionFilters onFilter={handleFilter} />}

      {/* Tabela de Transações */}
      <TransactionTable
        transactions={filteredTransactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Diálogo de Confirmação de Exclusão */}
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
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Transactions;
