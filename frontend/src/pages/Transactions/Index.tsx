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
  Grid,
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

  useEffect(() => {
    if (transactions.length > 0) {
      handleFilter({
        type: 'all',
        category: '',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      });
    }
  }, [transactions]);

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

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter((t) => t.category === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter((t) => t.subCategory === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.endDate));
    }

    setFilteredTransactions(filtered);
  };

  const handleClearFilter = () => {
    handleFilter({
      type: 'all',
      category: '',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
    });
  };

  return (
    <Box sx={{ px: 2, pb: 4 }}>
      <Box
        sx={{
          backgroundColor: '#16A085', // Usando a cor primária da paleta
          color: 'white',
          borderRadius: 2,
          p: 4,
          mb: 3,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            mb: 1,
          }}
        >
          Minhas Transações
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.85 }}>
          Gerencie suas receitas e despesas de forma prática
        </Typography>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <TransactionFilters onFilter={handleFilter} onClearFilter={handleClearFilter} />
        </Grid>
        <Grid item xs={12} md={4} textAlign={isSmallScreen ? 'center' : 'right'}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/transactions/new')}
            sx={{
              backgroundColor: '#27AE60', // Cor de sucesso para destaque
              boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease',
              ':hover': {
                backgroundColor: '#E67E22', // Usando a cor de atenção (coral) para hover
                transform: 'scale(1.1)',
                boxShadow: '0px 6px 25px rgba(0,0,0,0.3)',
              },
              color: 'white', // Mantém o texto branco no hover
            }}
          >
            Nova Transação
          </Button>
        </Grid>
      </Grid>

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
          sx={{
            backgroundColor: '#27AE60',
            ':hover': {
              backgroundColor: '#E67E22', // Coral no hover
            },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
    </Box>
  );
};

export default Transactions;
