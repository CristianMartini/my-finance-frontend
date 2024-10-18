// src/components/Layout/index.tsx
import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);  // Alterna o estado de aberto/fechado da Sidebar
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Passa a função de abrir/fechar e o estado da Sidebar para a Navbar e Sidebar */}
      <Navbar toggleDrawer={toggleDrawer} />
      <Sidebar open={sidebarOpen} toggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Isso é para alinhar com a AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
