// src/components/TransactionForm/index.tsx

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/categories';
import { TransactionFormInputs } from '../../types';

// Esquema de validação com Yup
const schema = yup
  .object({
    description: yup.string().required('A descrição é obrigatória'),
    amount: yup
      .number()
      .typeError('O valor deve ser um número')
      .positive('O valor deve ser positivo')
      .required('O valor é obrigatório'),
    date: yup
      .string()
      .required('A data é obrigatória')
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido'),
    category: yup
      .string()
      .oneOf(['income', 'expense'], 'Categoria inválida')
      .required('A categoria é obrigatória'),
    subCategory: yup.string().required('A subcategoria é obrigatória'),
    type: yup.string().required('O tipo é obrigatório'),
    source: yup.string().required('A fonte é obrigatória'),
    isParcelado: yup.boolean().required('O campo Parcelado é obrigatório'),
    parcelas: yup
      .number()
      .typeError('Parcelas devem ser um número')
      .min(1, 'Deve ter pelo menos 1 parcela')
      .when('isParcelado', {
        is: true,
        then: (schema) => schema.required('Número de parcelas é obrigatório'),
        otherwise: (schema) => schema.notRequired(),
      }),
    notes: yup.string(),
  })
  .required();

interface TransactionFormProps {
  onSubmit: SubmitHandler<TransactionFormInputs>;
  initialData?: TransactionFormInputs;
  mode: 'add' | 'edit';
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<TransactionFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newSource, setNewSource] = useState<string>('');

  const category = watch('category');
  const subCategory = watch('subCategory');
  const isParcelado = watch('isParcelado');
  const navigate = useNavigate();

  // Atualiza subcategorias dinamicamente com base na categoria selecionada
  useEffect(() => {
    if (category && categories[category]) {
      const categoryData = categories[category];
      setSubCategories(Object.keys(categoryData));
      // Resetar subCategory e type quando a categoria muda
      setValue('subCategory', '');
      setValue('type', '');
      setTypes([]);
    } else {
      setSubCategories([]);
      setTypes([]);
    }
  }, [category, setValue]);

  // Atualiza tipos dinamicamente com base na subcategoria selecionada
  useEffect(() => {
    if (category && subCategory && categories[category]?.[subCategory]) {
      const typesData = categories[category][subCategory];
      setTypes(Object.keys(typesData));
      // Resetar type quando a subCategory muda
      setValue('type', '');
    } else {
      setTypes([]);
    }
  }, [category, subCategory, setValue]);

  // Carregar fontes de recurso do localStorage
  useEffect(() => {
    const storedSources = JSON.parse(localStorage.getItem('sources') || '[]');
    setSources(storedSources);
  }, []);

  // Adicionar nova fonte ao localStorage e atualizar lista
  const addNewSource = () => {
    if (newSource.trim() === '') return;
    const updatedSources = [...sources, newSource.trim()];
    setSources(updatedSources);
    localStorage.setItem('sources', JSON.stringify(updatedSources));
    setValue('source', newSource.trim());
    setNewSource('');
    setOpenDialog(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="transaction-form"
      noValidate
      sx={{ mt: 3 }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        {mode === 'add' ? 'Nova Transação' : 'Editar Transação'}
      </Typography>

      <Grid container spacing={2}>
        {/* Descrição */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Descrição"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>

        {/* Valor */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Valor"
            type="number"
            {...register('amount')}
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
        </Grid>

        {/* Data */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Data"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('date')}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        </Grid>

        {/* Categoria */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel id="category-label">Categoria</InputLabel>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select labelId="category-label" label="Categoria" {...field}>
                  <MenuItem value="income">Receita</MenuItem>
                  <MenuItem value="expense">Despesa</MenuItem>
                </Select>
              )}
            />
            {errors.category && (
              <Typography variant="caption" color="error">
                {errors.category.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Subcategoria */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.subCategory} disabled={!category}>
            <InputLabel id="subCategory-label">Subcategoria</InputLabel>
            <Controller
              name="subCategory"
              control={control}
              render={({ field }) => (
                <Select labelId="subCategory-label" label="Subcategoria" {...field}>
                  {subCategories.map((sub) => (
                    <MenuItem key={sub} value={sub}>
                      {sub}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.subCategory && (
              <Typography variant="caption" color="error">
                {errors.subCategory.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Tipo */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.type} disabled={!subCategory}>
            <InputLabel id="type-label">Tipo</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select labelId="type-label" label="Tipo" {...field}>
                  {types.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.type && (
              <Typography variant="caption" color="error">
                {errors.type.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Fonte do Recurso */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.source}>
            <InputLabel id="source-label">Fonte do Recurso</InputLabel>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="source-label"
                  label="Fonte do Recurso"
                  {...field}
                  onChange={(event) => {
                    if (event.target.value === 'add_new') {
                      setOpenDialog(true);
                    } else {
                      field.onChange(event);
                    }
                  }}
                >
                  {sources.map((src) => (
                    <MenuItem key={src} value={src}>
                      {src}
                    </MenuItem>
                  ))}
                  <MenuItem value="add_new">+ Adicionar Nova Fonte</MenuItem>
                </Select>
              )}
            />
            {errors.source && (
              <Typography variant="caption" color="error">
                {errors.source.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Parcelamento */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={<Checkbox {...register('isParcelado')} />}
            label="Parcelado"
          />
        </Grid>

        {/* Número de Parcelas */}
        {isParcelado && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número de Parcelas"
              type="number"
              {...register('parcelas')}
              error={!!errors.parcelas}
              helperText={errors.parcelas?.message}
            />
          </Grid>
        )}

        {/* Notas/Opcional */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas (Opcional)"
            multiline
            rows={3}
            {...register('notes')}
          />
        </Grid>
      </Grid>

      {/* Diálogo para Adicionar Nova Fonte */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Adicionar Nova Fonte</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Nova Fonte"
            fullWidth
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={addNewSource} variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botões */}
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {mode === 'add' ? 'Adicionar' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionForm;
