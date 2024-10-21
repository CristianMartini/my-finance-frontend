import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll'; // Ícone para o botão de limpar
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
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // Atualiza as opções de categoria de acordo com o tipo selecionado
  useEffect(() => {
    const categoryList: string[] = [];

    if (type === 'income' || type === 'all') {
      Object.keys(categories.income).forEach((cat) => {
        categoryList.push(cat);
      });
    }

    if (type === 'expense' || type === 'all') {
      Object.keys(categories.expense).forEach((cat) => {
        categoryList.push(cat);
      });
    }

    setCategoryOptions(categoryList);
  }, [type]);

  // Função para aplicar o filtro
  const handleFilter = () => {
    onFilter({
      type: type === 'all' ? undefined : type,
      category: category || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  // Função para resetar os filtros e limpar o estado
  const handleReset = () => {
    setType('all');
    setCategory('');
    setStartDate('');
    setEndDate('');
    onClearFilter(); // Limpa o estado de filtragem
  };

  return (
    <Box className="transaction-filters" mb={2}>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        {/* Tipo de Transação */}
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

        {/* Categoria */}
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

        {/* Data Início */}
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

        {/* Data Fim */}
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

        {/* Botões */}
        <Grid item xs={12} sm={3} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            startIcon={<SearchIcon />}
            size="small"
          >
            Filtrar
          </Button>
          <Button
            className="clear-filters" // Classe adicionada para o botão "Limpar Filtros"
            variant="outlined"
            onClick={handleReset}
            startIcon={<ClearAllIcon />}
            size="small"
          >
            Limpar Filtros
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionFilters;
