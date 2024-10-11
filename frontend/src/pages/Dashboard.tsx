import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Receitas', value: 4000 },
  { name: 'Despesas', value: 2400 },
];

const COLORS = ['#0088FE', '#FF8042'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Olá, {user?.name}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Saldo Atual</Typography>
              <Typography variant="h5">R$ 1600,00</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Adicione mais cartões conforme necessário */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Resumo Financeiro</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
