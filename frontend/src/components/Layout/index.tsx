// src/components/Layout/index.tsx

import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Isso é para alinhar com a AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
