// src/components/TransactionTable/index.tsx

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './styles.css';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return <Typography variant="h6" align="center" mt={4}>Nenhuma transação encontrada.</Typography>;
  }

  return (
    <TableContainer component={Paper} className="transaction-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Typography color={transaction.type === 'income' ? 'green' : 'red'}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
                </Typography>
              </TableCell>
              <TableCell>{transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Data inválida'}</TableCell>
              <TableCell>
                <Typography color={transaction.type === 'income' ? 'green' : 'red'}>
                  {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(transaction)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(transaction)}>
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
