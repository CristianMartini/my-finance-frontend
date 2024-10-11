import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      // Chame a API para obter as transações
      // Exemplo:
      // const response = await api.get('/transactions');
      // setTransactions(response.data);
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Transações
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/transactions/new')}>
        Nova Transação
      </Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.type === 'income' ? 'Receita' : 'Despesa'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => navigate(`/transactions/edit/${transaction.id}`)}>
                    Editar
                  </Button>
                  <Button size="small" color="error">
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default Transactions;
