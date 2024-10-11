// src/pages/Dashboard.tsx

import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';

const Dashboard: React.FC = () => {
  // Dados simulados, substituir por dados reais da API
  const totalIncome = 5000;
  const totalExpense = 2000;
  const balance = totalIncome - totalExpense;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e0f7fa' }}>
            <CardContent>
              <Typography variant="h6">Receitas</Typography>
              <Typography variant="h5">R$ {totalIncome.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6">Despesas</Typography>
              <Typography variant="h5">R$ {totalExpense.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6">Saldo</Typography>
              <Typography variant="h5">R$ {balance.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
