import React, { useState } from 'react';
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
import { Edit, Delete, StickyNote2 } from '@mui/icons-material'; // Alterando o ícone de nota para StickyNote2
import { useTheme } from '@mui/material/styles';
import { Transaction } from '../../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estado para abrir o modal com a nota
  const [noteOpen, setNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const handleNoteOpen = (note: string | undefined) => {
    setSelectedNote(note ?? null); // Corrige para garantir que 'undefined' seja tratado como 'null'
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

  if (transactions.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Nenhuma transação encontrada.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} className="transaction-table" sx={{ boxShadow: 3 }}>
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
            {transactions.map((transaction) => (
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

                  {/* Ícone de nota com espaço reservado, mesmo que não haja nota */}
                  <Box sx={{ width: 48, textAlign: 'center' }}>
                    {transaction.notes && (
                      <IconButton color="info" onClick={() => handleNoteOpen(transaction.notes)}>
                        <StickyNote2 /> {/* Ícone de nota mais adequado */}
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
          {transactions.map((transaction) => (
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

                {/* Ícone de nota com espaço reservado, mesmo que não haja nota */}
                <Box sx={{ width: 48, textAlign: 'center' }}>
                  {transaction.notes && (
                    <IconButton color="info" onClick={() => handleNoteOpen(transaction.notes)}>
                      <StickyNote2 /> {/* Ícone de nota mais adequado */}
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

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
    </TableContainer>
  );
};

export default TransactionTable;
