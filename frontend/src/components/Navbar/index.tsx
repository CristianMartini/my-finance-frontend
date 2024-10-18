import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleDrawer: () => void;  // Recebe a função para abrir/fechar a Sidebar
}

const Navbar: React.FC<NavbarProps> = ({ toggleDrawer }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Ícone de menu para abrir a Sidebar */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}  // Chama a função para alternar a Sidebar
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Finance
        </Typography>
        {user && (
          <div>
            <Typography variant="subtitle1" component="span" sx={{ marginRight: 2 }}>
              Olá, {user.name}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="conta do usuário"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
