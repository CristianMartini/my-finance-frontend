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
  FormControlLabel
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { categories, CategoryType } from '../../data/categories';

// Interface para os dados do formulário
interface TransactionFormInputs {
  description: string;
  amount: number;
  date: string;
  category: keyof CategoryType;
  subCategory: string;
  type: string;
  source: string;
  isParcelado: boolean;
  parcelas?: number;
  notes?: string;
}

interface TransactionFormProps {
  onSubmit: SubmitHandler<TransactionFormInputs>;
  initialData?: TransactionFormInputs;
  mode: 'add' | 'edit';
}

// Esquema de validação com Yup
const schema = yup.object({
  description: yup.string().required('A descrição é obrigatória'),
  amount: yup
    .number()
    .typeError('O valor deve ser um número')
    .positive('O valor deve ser positivo')
    .required('O valor é obrigatório'),
  date: yup
    .string()
    .required('A data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido'), // Formato YYYY-MM-DD
  category: yup
    .string()
    .oneOf(['ganhos', 'despesas'], 'Categoria inválida')
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
      then: schema => schema.required('Número de parcelas é obrigatório'),
      otherwise: schema => schema.notRequired(),
    }),
  notes: yup.string(),
}).required();

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialData, mode }) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<TransactionFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const category = watch('category');
  const subCategory = watch('subCategory');
  const isParcelado = watch('isParcelado');
  const navigate = useNavigate();

  // Atualiza subcategorias dinamicamente com base na categoria selecionada
  useEffect(() => {
    if (category && categories[category]) {
      const categoryData = categories[category];
      setSubCategories(Object.keys(categoryData));
    } else {
      setSubCategories([]);
      setTypes([]);
    }
  }, [category]);

  // Atualiza tipos dinamicamente com base na subcategoria selecionada
 // Atualiza tipos dinamicamente com base na subcategoria selecionada
useEffect(() => {
    if (category && subCategory && categories[category]?.[subCategory]) {
      const categoryData = categories[category];
      const typesData = categoryData[subCategory];
      setTypes(Object.values(typesData).flat());
    } else {
      setTypes([]);
    }
  }, [category, subCategory]);
  

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="transaction-form" noValidate>
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        {mode === 'add' ? 'Nova Transação' : 'Editar Transação'}
      </Typography>

      {/* Descrição */}
      <TextField
        margin="normal"
        fullWidth
        label="Descrição"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      {/* Valor */}
      <TextField
        margin="normal"
        fullWidth
        label="Valor"
        type="number"
        {...register('amount')}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />

      {/* Data */}
      <TextField
        margin="normal"
        fullWidth
        label="Data"
        type="date"
        {...register('date')}
        error={!!errors.date}
        helperText={errors.date?.message}
      />

      {/* Categoria */}
      <FormControl fullWidth margin="normal" error={!!errors.category}>
        <InputLabel id="category-label">Categoria</InputLabel>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              labelId="category-label"
              label="Categoria"
              {...field}
            >
              <MenuItem value="ganhos">Ganhos</MenuItem>
              <MenuItem value="despesas">Despesas</MenuItem>
            </Select>
          )}
        />
        {errors.category && (
          <Typography variant="caption" color="error">
            {errors.category.message}
          </Typography>
        )}
      </FormControl>

      {/* Subcategoria */}
      <FormControl fullWidth margin="normal" error={!!errors.subCategory}>
        <InputLabel id="subCategory-label">Subcategoria</InputLabel>
        <Controller
          name="subCategory"
          control={control}
          render={({ field }) => (
            <Select
              labelId="subCategory-label"
              label="Subcategoria"
              {...field}
              disabled={!category} // Desabilitar até que a categoria seja selecionada
            >
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

      {/* Tipo */}
      <FormControl fullWidth margin="normal" error={!!errors.type}>
        <InputLabel id="type-label">Tipo</InputLabel>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              labelId="type-label"
              label="Tipo"
              {...field}
              disabled={!subCategory} // Desabilitar até que a subcategoria seja selecionada
            >
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

      {/* Fonte do Recurso */}
      <TextField
        margin="normal"
        fullWidth
        label="Fonte do Recurso"
        {...register('source')}
        error={!!errors.source}
        helperText={errors.source?.message}
      />

      {/* Parcelamento */}
      <FormControlLabel
        control={<Checkbox {...register('isParcelado')} />}
        label="Parcelado"
      />

      {/* Número de Parcelas */}
      {isParcelado && (
        <TextField
          margin="normal"
          fullWidth
          label="Número de Parcelas"
          type="number"
          {...register('parcelas')}
          error={!!errors.parcelas}
          helperText={errors.parcelas?.message}
        />
      )}

      {/* Notas/Opcional */}
      <TextField
        margin="normal"
        fullWidth
        label="Notas (Opcional)"
        multiline
        rows={3}
        {...register('notes')}
      />

      {/* Botões */}
      <Box mt={2} display="flex" justifyContent="space-between">
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
