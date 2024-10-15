// src/components/Statistics/index.tsx

import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './styles.css';

interface StatisticsProps {
  totalIncome: number;
  totalExpense: number;
}

const COLORS = ['#4caf50', '#f44336'];

const Statistics: React.FC<StatisticsProps> = ({ totalIncome, totalExpense }) => {
  const data = [
    { name: 'Receitas', value: totalIncome },
    { name: 'Despesas', value: totalExpense },
  ];

  const balance = totalIncome - totalExpense;

  return (
    <Grid container spacing={3} mt={2}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Saldo Atual
            </Typography>
            <Typography variant="h4" color={balance >= 0 ? 'success.main' : 'error.main'}>
              R$ {balance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumo Financeiro
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Statistics;
