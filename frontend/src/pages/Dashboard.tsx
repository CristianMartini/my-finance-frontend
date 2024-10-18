import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { Transaction } from '../types';

const COLORS = ['#0088FE', '#FF8042'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        const transactionsData = response.data;
        setTransactions(transactionsData);
        calculateTotals(transactionsData);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    };

    fetchTransactions();
  }, []);

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

  const data = [
    { name: 'Receitas', value: totalIncome },
    { name: 'Despesas', value: totalExpense },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Olá, {user?.name}
      </Typography>
      <Grid container spacing={3}>
        {/* Cartão de Saldo Atual */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Saldo Atual</Typography>
              <Typography
                variant="h5"
                color={balance >= 0 ? 'success.main' : 'error.main'}
              >
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Cartão de Total de Receitas */}
        <Grid item xs={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total de Receitas</Typography>
              <Typography variant="h5" color="success.main">
                R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Cartão de Total de Despesas */}
        <Grid item xs={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total de Despesas</Typography>
              <Typography variant="h5" color="error.main">
                R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Gráfico de Pizza */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Resumo Financeiro</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Lista de Últimas Transações */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Últimas Transações</Typography>
              <List>
                {transactions.slice(0, 5).map((transaction) => (
                  <ListItem key={transaction._id}>
                    <ListItemText
                      primary={transaction.description}
                      secondary={`R$ ${transaction.amount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} - ${new Date(transaction.date).toLocaleDateString('pt-BR')}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
