// TransactionFilters.tsx

import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import './styles.css';
import { categories } from '../../data/categories';

interface TransactionFiltersProps {
  onFilter: (filters: Filters) => void;
  onClearFilter: () => void;
}

interface Filters {
  type?: 'all' | 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ onFilter, onClearFilter }) => {
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [category, setCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    if (!initialized) {
      const now = new Date();
      const monthIndex = now.getMonth();
      const firstDayOfMonth = new Date(now.getFullYear(), monthIndex, 1).toISOString().split('T')[0];
      const lastDayOfMonth = new Date(now.getFullYear(), monthIndex + 1, 0).toISOString().split('T')[0];
      setStartDate(firstDayOfMonth);
      setEndDate(lastDayOfMonth);
      setSelectedMonthIndex(monthIndex);
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (startDate && endDate) {
      onFilter({
        type: type === 'all' ? undefined : type,
        category: category || undefined,
        startDate,
        endDate,
      });
    }
  }, [startDate, endDate, type, category, onFilter]);

  useEffect(() => {
    const categoryList: string[] = [];
    if (type === 'income' || type === 'all') {
      Object.keys(categories.income).forEach((cat) => categoryList.push(cat));
    }
    if (type === 'expense' || type === 'all') {
      Object.keys(categories.expense).forEach((cat) => categoryList.push(cat));
    }
    setCategoryOptions(categoryList);
  }, [type]);

  const handleMonthClick = (monthIndex: number) => {
    const now = new Date();
    const year = now.getFullYear();
    const firstDayOfMonth = new Date(year, monthIndex, 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0).toISOString().split('T')[0];
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
    setSelectedMonthIndex(monthIndex);
  };

  const handleReset = () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const firstDayOfMonth = new Date(now.getFullYear(), monthIndex, 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(now.getFullYear(), monthIndex + 1, 0).toISOString().split('T')[0];

    setType('all');
    setCategory('');
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
    setSelectedMonthIndex(monthIndex);

    onFilter({
      type: 'all',
      category: '',
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth,
    });

    onClearFilter();
  };

  return (
    <Box className="transaction-filters" mb={2}>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Tipo"
            fullWidth
            size="small"
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
            select
            label="Categoria"
            fullWidth
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={categoryOptions.length === 0}
          >
            <MenuItem value="">Todas</MenuItem>
            {categoryOptions.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            label="Data Início"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            label="Data Fim"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={3} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<ClearAllIcon />}
            size="small"
            sx={{
              ':hover': {
                backgroundColor: '#E67E22',
                color: 'white', // Mantém o texto visível no hover
              },
              color: '#16A085', // Cor primária fora do hover
            }}
          >
            Limpar Filtros
          </Button>
        </Grid>
      </Grid>

      <Box display="flex" flexWrap="wrap" gap={1} mt={2} justifyContent="center">
        {months.map((month, index) => (
          <Button
            key={index}
            variant={selectedMonthIndex === index ? "contained" : "outlined"}
            onClick={() => handleMonthClick(index)}
            size="small"
            sx={{
              ':hover': {
                backgroundColor: '#16A085', // Cor de fundo no hover
                color: 'white', // Mantém o texto visível no hover
              },
              color: selectedMonthIndex === index ? 'white' : '#16A085', // Texto branco quando selecionado
            }}
          >
            {month}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default TransactionFilters;
