import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemButton, IconButton, Toolbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation para verificar a rota atual
import { useTheme, useMediaQuery } from '@mui/material';
import { Icon } from '@iconify/react'; // Importa o Iconify

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Verifica a rota atual
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
            <ListItemButton
              onClick={() => { navigate(item.path); toggleDrawer(); }}
              sx={{
                backgroundColor: location.pathname === item.path ? '#E67E22' : 'transparent', // Cor de fundo se estiver selecionado
                color: location.pathname === item.path ? 'white' : 'inherit', // Cor do texto
                ':hover': {
                  backgroundColor: '#E67E22', // Cor de fundo ao passar o mouse
                  color: 'white', // Cor do texto no hover
                },
              }}
            >
              <IconButton>
                {/* Ícone do Iconify */}
                <Icon icon={item.icon} width={24} height={24} color={location.pathname === item.path ? 'white' : 'inherit'} />
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
