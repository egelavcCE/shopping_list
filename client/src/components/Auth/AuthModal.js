import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AuthModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (tab === 1) { // Register
      if (formData.password !== formData.confirmPassword) {
        setError('Şifreler eşleşmiyor');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır');
        return false;
      }
      if (!formData.name.trim()) {
        setError('Ad Soyad alanı boş bırakılamaz');
        return false;
      }
    }
    if (!formData.email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (tab === 0) { // Login
        await login(formData.email, formData.password);
      } else { // Register
        await register(formData.email, formData.password, formData.name);
      }
      onClose();
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="auth-modal-title"
    >
      <Box sx={modalStyle}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="auth-modal-title" variant="h5" component="h2" align="center" gutterBottom>
          {tab === 0 ? 'Giriş Yap' : 'Üye Ol'}
        </Typography>

        <Tabs value={tab} onChange={handleChange} centered sx={{ mb: 3 }}>
          <Tab label="Giriş Yap" />
          <Tab label="Üye Ol" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="Ad Soyad"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />
          )}
          
          <TextField
            fullWidth
            label="E-posta"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Şifre"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />
          
          {tab === 1 && (
            <TextField
              fullWidth
              label="Şifre Tekrar"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              tab === 0 ? 'Giriş Yap' : 'Üye Ol'
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AuthModal; 