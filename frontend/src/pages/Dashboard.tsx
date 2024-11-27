import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import api from '../services/api';
import { Transaction } from '../types';
import TransactionFilters from '../components/TransactionFilters';
import { categories } from '../data/categories';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const COLORS = ['#16A085', '#E67E22'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      const transactionsData = response.data;
      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData);
      calculateTotals(transactionsData);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const calculateTotals = (transactions: Transaction[]) => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      if (transaction.category === 'income') {
        income += transaction.amount;
      } else if (transaction.category === 'expense') {
        expense += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setBalance(income - expense);
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
    calculateTotals(filtered);
  };

  const handleClearFilter = () => {
    setFilteredTransactions(transactions);
    calculateTotals(transactions);
  };

  const allCategories = [
    ...Object.keys(categories.income),
    ...Object.keys(categories.expense),
  ];

  const categoriesData = allCategories.map((category) => {
    const income = filteredTransactions
      .filter((t) => t.category === 'income' && t.subCategory === category)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.category === 'expense' && t.subCategory === category)
      .reduce((sum, t) => sum + t.amount, 0);

    return { name: category, income, expense };
  });

  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const income = filteredTransactions
      .filter((t) => new Date(t.date).getMonth() === index && t.category === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => new Date(t.date).getMonth() === index && t.category === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { month, income, expense };
  });

  return (
    <div>
    <Typography
      variant={isSmallScreen ? 'h3' : 'h2'}
      align="center"
      gutterBottom
      sx={{
        mb: 4,
        fontWeight: 800,
        backgroundColor: '#16A085',
        color: 'white',
        padding: '16px',
        borderRadius: 2,
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      Olá, {user?.name}, bem-vindo ao seu painel financeiro!
    </Typography>

    
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

      <Grid container spacing={3} mt={2}>
        {/* Saldo Atual e Últimas Transações */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  backgroundColor: balance >= 0 ? '#27AE60' : '#E67E22',
                  color: '#FFFFFF',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  mb: 2,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Saldo Atual
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Últimas Transações
              </Typography>
              <List>
                {filteredTransactions.slice(0, 5).map((transaction) => (
                  <ListItem key={transaction._id}>
                    <ListItemText
                      primary={transaction.description}
                      secondary={`R$ ${transaction.amount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })} - ${new Date(transaction.date).toLocaleDateString('pt-BR')}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Gráfico de Pizza */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição Financeira
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Receitas', value: totalIncome },
                      { name: 'Despesas', value: totalExpense },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    <Cell fill="#16A085" />
                    <Cell fill="#E67E22" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos em Paralelo */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Evolução Mensal</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" tickFormatter={(tick) => `M${tick}`} />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#16A085" name="Receitas" />
                  <Line type="monotone" dataKey="expense" stroke="#E67E22" name="Despesas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Receitas e Despesas por Categoria</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoriesData}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#16A085" name="Receitas" />
                  <Bar dataKey="expense" fill="#E67E22" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
