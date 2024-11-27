import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemButton, IconButton, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { Icon } from '@iconify/react';  // Importa o Iconify

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Dashboard', icon: 'mdi:monitor-dashboard', path: '/' }, // Icone de Dashboard do Iconify
    { text: 'Transações', icon: 'mdi:cash-multiple', path: '/transactions' }, // Icone de Transações
   
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer}
      variant={isMobile ? 'temporary' : 'permanent'}
      sx={{
        width: isMobile ? 200 : 240,
        [`& .MuiDrawer-paper`]: {
          width: isMobile ? 200 : 240,
          boxSizing: 'border-box',
          boxShadow: '5px 0 15px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Toolbar /> {/* Isso alinha o Drawer com a AppBar */}
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => { navigate(item.path); toggleDrawer(); }}>
              <IconButton>
                {/* Ícone do Iconify */}
                <Icon icon={item.icon} width={24} height={24} />
              </IconButton>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
