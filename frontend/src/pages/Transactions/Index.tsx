// frontend\src\pages\Transactions\Index.tsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../../components/TransactionTable';
import TransactionFilters from '../../components/TransactionFilters';
import { Transaction } from '../../types';
import api from '../../services/api';
import AddIcon from '@mui/icons-material/Add';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (err) {
      setError('Erro ao carregar transações.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    navigate(`/transactions/edit/${transaction._id}`);
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await api.delete(`/transactions/${transactionToDelete._id}`);
      const updatedTransactions = transactions.filter(
        (t) => t._id !== transactionToDelete._id
      );
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (err) {
      setError('Erro ao excluir transação.');
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = [...transactions];

    // Filtro por tipo de transação
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter((t) => t.category === filters.type);
    }

    // Filtro por categoria
    if (filters.category) {
      filtered = filtered.filter((t) => t.subCategory === filters.category);
    }

    // Filtro por data de início
    if (filters.startDate) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.startDate));
    }

    // Filtro por data de fim
    if (filters.endDate) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.endDate));
    }

    setFilteredTransactions(filtered);
  };

  const handleClearFilter = () => {
    setFilteredTransactions(transactions); // Reseta para todas as transações
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Transações
        </Typography>
        {!isSmallScreen && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/transactions/new')}
          >
            Nova Transação
          </Button>
        )}
      </Box>
      <TransactionFilters onFilter={handleFilter} onClearFilter={handleClearFilter} />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {isSmallScreen && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/transactions/new')}
          style={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      )}
      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta transação?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Transactions;
