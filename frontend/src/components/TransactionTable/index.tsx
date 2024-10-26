import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, StickyNote2 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Transaction } from '../../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  startDate?: string;
  endDate?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  startDate,
  endDate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estado para abrir o modal com a nota
  const [noteOpen, setNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const handleNoteOpen = (note: string | undefined) => {
    setSelectedNote(note ?? null);
    setNoteOpen(true);
  };

  const handleNoteClose = () => {
    setNoteOpen(false);
    setSelectedNote(null);
  };

  const truncateText = (text: string, limit: number) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  // Filtra as transações com base nas datas fornecidas
  const filteredTransactions = useMemo(() => {
    if (!startDate || !endDate) return transactions;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions, startDate, endDate]);

  // Cálculo dos totais usando useMemo para otimizar a performance
  const totalIncome = useMemo(
    () => filteredTransactions
      .filter((transaction) => transaction.category === 'income')
      .reduce((acc, transaction) => acc + transaction.amount, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(
    () => filteredTransactions
      .filter((transaction) => transaction.category === 'expense')
      .reduce((acc, transaction) => acc + transaction.amount, 0),
    [filteredTransactions]
  );

  const balance = totalIncome - totalExpense;

  if (filteredTransactions.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Nenhuma transação encontrada.
      </Typography>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} className="transaction-table" sx={{ boxShadow: 3, mb: 2 }}>
        {!isMobile ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Descrição</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Valor</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Data</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Categoria</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Tipo</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Fonte</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction._id}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#f9f9f9',
                    },
                  }}
                >
                  <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Tooltip title={transaction.description} placement="top">
                      <Typography>
                        {truncateText(transaction.description, 25)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography
                      color={transaction.category === 'income' ? 'success.main' : 'error.main'}
                    >
                      {transaction.category === 'income' ? '+' : '-'} R${' '}
                      {transaction.amount.toFixed(2).slice(0, 10)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{transaction.subCategory}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{transaction.type}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{transaction.source}</TableCell>
                  <TableCell sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    <IconButton color="primary" onClick={() => onEdit(transaction)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(transaction)}>
                      <Delete />
                    </IconButton>
                    <Box sx={{ width: 48, textAlign: 'center' }}>
                      {transaction.notes && (
                        <IconButton color="info" onClick={() => handleNoteOpen(transaction.notes)}>
                          <StickyNote2 />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {filteredTransactions.map((transaction) => (
              <Paper key={transaction._id} elevation={2} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {transaction.description}
                  </Typography>
                  <Typography
                    color={transaction.category === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.category === 'income' ? '+' : '-'} R${' '}
                    {transaction.amount.toFixed(2).slice(0, 10)}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">{transaction.subCategory}</Typography>
                  <Typography variant="body2">{transaction.type}</Typography>
                  <Typography variant="body2">{transaction.source}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <IconButton color="primary" onClick={() => onEdit(transaction)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(transaction)}>
                    <Delete />
                  </IconButton>
                  <Box sx={{ width: 48, textAlign: 'center' }}>
                    {transaction.notes && (
                      <IconButton color="info" onClick={() => handleNoteOpen(transaction.notes)}>
                        <StickyNote2 />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </TableContainer>

      {/* Seção de Totais */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f4f4f4',
          borderRadius: 2,
          p: 2,
          mt: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" color="success.main">
          Total de Receitas: R$ {totalIncome.toFixed(2)}
        </Typography>
        <Typography variant="h6" color="error.main">
          Total de Despesas: R$ {totalExpense.toFixed(2)}
        </Typography>
        <Typography
          variant="h6"
          color={balance >= 0 ? 'success.main' : 'error.main'}
        >
          Saldo: R$ {balance.toFixed(2)}
        </Typography>
      </Box>

      {/* Modal para exibir as notas */}
      <Dialog open={noteOpen} onClose={handleNoteClose}>
        <DialogTitle>Nota da Transação</DialogTitle>
        <DialogContent>
          <Typography>{selectedNote}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoteClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionTable;
