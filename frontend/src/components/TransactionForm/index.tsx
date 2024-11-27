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
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { categories } from '../../data/categories'; // Arquivo que contém as categorias, subcategorias e tipos
import { TransactionFormInputs } from '../../types';

// Esquema de validação com Yup
const schema = yup
  .object({
    description: yup.string().required('A descrição é obrigatória'),
    amount: yup
      .number()
      .typeError('O valor deve ser um número')
      .positive('O valor deve ser positivo')
      .max(1000000, 'O valor não pode exceder R$ 1.000.000,00')
      .test('decimals', 'O valor pode ter no máximo 2 casas decimais', (value) => {
        return /^\d+(\.\d{1,2})?$/.test(value?.toString() || ''); // Limita para 2 casas decimais
      })
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
    notes: yup
      .string()
      .max(100, 'A nota deve ter no máximo 100 caracteres'),
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
  const [sources, setSources] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newSource, setNewSource] = useState<string>('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);

  const category = watch('category');
  const subCategory = watch('subCategory');
  const isParcelado = watch('isParcelado');
  const navigate = useNavigate();

  // Atualiza subcategorias dinamicamente com base na categoria selecionada
  useEffect(() => {
    if (category && categories[category]) {
      const categoryData = categories[category];
      setSubCategories(Object.keys(categoryData));
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
      setValue('type', '');
    } else {
      setTypes([]);
    }
  }, [category, subCategory, setValue]);

  // Carregar fontes do backend no início
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await api.get('/sources');
        setSources(response.data);
      } catch (error) {
        console.error('Erro ao carregar fontes:', error);
      }
    };
    fetchSources();
  }, []);

  // Adicionar nova fonte ao backend e atualizar a lista sem recarregar a página
  const addNewSource = async () => {
    if (newSource.trim() === '') return;

    try {
      const response = await api.post('/sources', { name: newSource.trim() });
      setSources((prevSources) => [...prevSources, response.data]);
      setValue('source', response.data.name); // Mantém a nova fonte selecionada
      setNewSource(''); // Limpa o campo de input
      setOpenDialog(false);
    } catch (error) {
      console.error('Erro ao adicionar nova fonte:', error);
    }
  };

  // Função para abrir o diálogo de confirmação de exclusão
  const handleDeleteClick = (sourceId: string) => {
    setSourceToDelete(sourceId);
    setConfirmDialogOpen(true);
  };

  // Função para deletar uma fonte
  const deleteSource = async () => {
    if (!sourceToDelete) return;

    try {
      await api.delete(`/sources/${sourceToDelete}`);
      setSources((prevSources) => prevSources.filter((src) => src._id !== sourceToDelete));
      setSnackbarMessage('Fonte deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar fonte:', error);
      setSnackbarMessage('Erro ao deletar a fonte.');
    }
    setConfirmDialogOpen(false);
    setSourceToDelete(null);
  };
  const [noteLength, setNoteLength] = useState(0);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate

      sx={{
        mt: 4,
        maxWidth: 800,
        mx: 'auto',
        p: 4,
        backgroundColor: '#F8F5F2', // Cor suave para o fundo
        borderRadius: 3,
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.5)', // Sombra mais suave
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
        sx={{
          mb: 2,
          fontWeight: 800,
          color: '#16A085',
          textShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        {mode === 'add' ? 'Adicionar Nova Transação' : 'Editar Transação'}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          mb: 3,
          color: '#7F8C8',
          opacity: 0.9,
        }}
      >
        {mode === 'add'
          ? 'Adicione uma nova transação para acompanhar suas finanças de forma simples e prática.'
          : 'Edite os detalhes da sua transação e mantenha suas finanças organizadas.'}
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
            size="small"
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
            inputProps={{ step: "0.01" }} // Define o step como 0.01 para limitar a 2 casas decimais
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
            size="small"
          />
        </Grid>

        {/* Categoria */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.category} size="small">
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
          <FormControl fullWidth error={!!errors.subCategory} disabled={!category} size="small">
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
          <FormControl fullWidth error={!!errors.type} disabled={!subCategory} size="small">
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
          <FormControl fullWidth error={!!errors.source} size="small">
            <InputLabel id="source-label">Fonte do Recurso </InputLabel>
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
                      field.onChange(event.target.value);
                    }
                  }}
                >
                  {sources.map((src) => (
                    <MenuItem key={src._id} value={src.name}>
                      <Box display="flex" justifyContent="space-between" width="100%">
                        {src.name}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(src._id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
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

        {isParcelado && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número de Parcelas"
              type="number"
              {...register('parcelas')}
              error={!!errors.parcelas}
              helperText={errors.parcelas?.message}
              size="small"
            />
          </Grid>
        )}

        {/* Notas/Opcional */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas"
            {...register('notes')}
            error={!!errors.notes}
            helperText={`${noteLength}/100 caracteres`}
            size="small"
            multiline
            rows={4}
            inputProps={{ maxLength: 100 }} // Limite de 255 caracteres
            onChange={(e) => setNoteLength(e.target.value.length)} // Atualiza o contador
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
  <Button
    onClick={() => setOpenDialog(false)}
    sx={{
      color: '#16A085', // Cor padrão do texto para o botão Cancelar
      borderColor: '#16A085', // Cor da borda para o botão Cancelar
      ':hover': {
        backgroundColor: '#E67E22', // Cor de fundo ao passar o mouse no botão Cancelar
        color: 'white', // Cor do texto ao passar o mouse no botão Cancelar
      },
    }}
  >
    Cancelar
  </Button>
  
  <Button
    onClick={addNewSource} 
    variant="contained"
    sx={{
      backgroundColor: '#27AE60', // Cor de fundo padrão para o botão Adicionar
      color: 'white', // Cor do texto padrão para manter o contraste
      ':hover': {
        backgroundColor: '#E67E22', // Cor de fundo ao passar o mouse
        color: 'white', // Cor do texto ao passar o mouse
      },
    }}
  >
    Salvar
  </Button>
</DialogActions>


      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza de que deseja excluir esta fonte?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
          <Button onClick={deleteSource} variant="contained" color="primary">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botões */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            color: '#16A085',
            borderColor: '#16A085',
            ':hover': {
              backgroundColor: '#E67E22',
              color: 'white',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#27AE60',
            ':hover': {
              backgroundColor: '#E67E22',
            },
          }}
        >
          {mode === 'add' ? 'Adicionar' : 'Salvar'}
        </Button>
      </Box>


      {/* Snackbar para feedback */}
      {snackbarMessage && (
        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={6000}
          onClose={() => setSnackbarMessage(null)}
        >
          <Alert onClose={() => setSnackbarMessage(null)} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TransactionForm;
