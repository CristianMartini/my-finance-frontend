// src/components/TransactionFilters/index.tsx

import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid } from '@mui/material';
import './styles.css';

interface TransactionFiltersProps {
  onFilter: (filters: Filters) => void;
}

interface Filters {
  type: 'all' | 'income' | 'expense';
  startDate?: string;
  endDate?: string;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ onFilter }) => {
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleFilter = () => {
    onFilter({
      type,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    setType('all');
    setStartDate('');
    setEndDate('');
    onFilter({ type: 'all' });
  };

  return (
    <Box className="transaction-filters" mb={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Tipo"
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value as 'all' | 'income' | 'expense')}
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="income">Receitas</MenuItem>
            <MenuItem value="expense">Despesas</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Data Início"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Data Fim"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleFilter}>
              Filtrar
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Resetar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionFilters;
