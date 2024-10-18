// src/routes/index.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions/Index';
import NewTransaction from '../pages/Transactions/NewTransaction';
import EditTransaction from '../pages/Transactions/EditTransaction';
import Profile from '../pages/Profile';
import ProtectedRoute from './ProtectedRoute';
import { Typography } from '@mui/material';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/new"
        element={
          <ProtectedRoute>
            <NewTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/edit/:id"
        element={
          <ProtectedRoute>
            <EditTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      {/* Rotas não encontradas */}
      <Route path="*" element={<Typography variant="h4">Página Não Encontrada</Typography>} />
    </Routes>
  );
};

export default AppRoutes;
