import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  TextField,
  Button,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Favorite,
  History,
  Lock,
  Logout,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AuthModal from '../Auth/AuthModal';

const Header = ({ onSearch, cartItems, favorites }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleAccountMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleAccountMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Alışveriş Listesi
          </Typography>

          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <TextField
              size="small"
              placeholder="Ürün Ara..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />
          </Box>

          <Tooltip title={mode === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>

          {isAuthenticated ? (
            <>
              <Tooltip title="Favorilerim">
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/favorites')}
                >
                  <Badge badgeContent={favorites?.length || 0} color="error">
                    <Favorite />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Sepetim">
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/cart')}
                >
                  <Badge badgeContent={cartItems?.length || 0} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Hesabım">
                <IconButton
                  color="inherit"
                  onClick={handleAccountMenuClick}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAccountMenuClose}
              >
                <MenuItem sx={{ 
                  pointerEvents: 'none', 
                  backgroundColor: 'action.hover',
                  fontWeight: 'bold'
                }}>
                  {user?.name || 'Kullanıcı'}
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('/history')}>
                  <History sx={{ mr: 1 }} /> Geçmiş Listeler
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('/change-password')}>
                  <Lock sx={{ mr: 1 }} /> Şifre Değiştir
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Çıkış Yap
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => setAuthModalOpen(true)}
            >
              Giriş Yap / Üye Ol
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Header; 