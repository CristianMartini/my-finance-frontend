//frontend\src\components\TransactionTable\index.tsx
import React from 'react';
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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
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
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Fonte</TableCell>
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
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Typography
                    color={transaction.category === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.category === 'income' ? '+' : '-'} R${' '}
                    {transaction.amount.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.subCategory}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.source}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(transaction)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {transactions.map((transaction) => (
            <Paper
              key={transaction._id}
              elevation={2}
              sx={{ p: 2, backgroundColor: '#f9f9f9' }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {transaction.description}
                </Typography>
                <Typography
                  color={transaction.category === 'income' ? 'success.main' : 'error.main'}
                >
                  {transaction.category === 'income' ? '+' : '-'} R${' '}
                  {transaction.amount.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  {new Date(transaction.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">{transaction.subCategory}</Typography>
                <Typography variant="body2">{transaction.type}</Typography>
                <Typography variant="body2">{transaction.source}</Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <IconButton
                  color="primary"
                  onClick={() => onEdit(transaction)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(transaction)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </TableContainer>
  );
};

export default TransactionTable;
