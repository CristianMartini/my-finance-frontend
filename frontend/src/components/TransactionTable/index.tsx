// src/components/TransactionTable/index.tsx

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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './styles.css';
import { TransactionFormInputs } from '../../types';

interface Transaction extends TransactionFormInputs {
  id: number;
}

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
    <TableContainer component={Paper} className="transaction-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell>Valor</TableCell>
            {!isMobile && <TableCell>Data</TableCell>}
            {!isMobile && <TableCell>Categoria</TableCell>}
            {!isMobile && <TableCell>Tipo</TableCell>}
            {!isMobile && <TableCell>Fonte</TableCell>}
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
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
                  color={
                    transaction.category === 'income' ? 'success.main' : 'error.main'
                  }
                >
                  {transaction.category === 'income' ? '+' : '-'} R${' '}
                  {transaction.amount.toFixed(2)}
                </Typography>
              </TableCell>
              {!isMobile && (
                <>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.subCategory}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.source}</TableCell>
                </>
              )}
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
    </TableContainer>
  );
};

export default TransactionTable;
