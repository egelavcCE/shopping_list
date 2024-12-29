import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Container,
  Typography,
  Pagination,
  Alert,
  Snackbar,
  Button,
  TextField
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import ProductCard from './ProductCard';
import productsData from '../data/data.json';
import { useAuth } from '../contexts/AuthContext';

const ShoppingList = ({ searchTerm, onSearchChange, onAddToList, onAddToFavorites }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    action: null
  });
  const itemsPerPage = 48;

  // Filter products based on search term
  const filteredProducts = productsData.filter(product =>
    product["Ürün Adı"].toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToListClick = async (product) => {
    if (!isAuthenticated) return;
    
    try {
      await onAddToList(product);
      setSnackbar({
        open: true,
        message: 'Ürün listeye eklendi',
        severity: 'success',
        action: (
          <Button 
            color="inherit" 
            size="small" 
            startIcon={<ShoppingCart />}
            onClick={() => navigate('/cart')}
          >
            Listeye Git
          </Button>
        )
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'warning',
        action: null
      });
    }
  };

  const handleAddToFavoritesClick = (product) => {
    if (!isAuthenticated) return;

    try {
      onAddToFavorites(product);
      setSnackbar({
        open: true,
        message: 'Ürün favorilere eklendi',
        severity: 'success',
        action: null
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'warning',
        action: null
      });
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Alışveriş Listesi
      </Typography>

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Ürünleri favorilere eklemek ve alışveriş listesi oluşturmak için giriş yapmalısınız.
        </Alert>
      )}

      <TextField
        fullWidth
        label="Ürün Ara"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={3}>
        {currentProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ProductCard
              product={product}
              onAddToList={handleAddToListClick}
              onAddToFavorites={handleAddToFavoritesClick}
              isAuthenticated={isAuthenticated}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        action={snackbar.action}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          action={snackbar.action}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShoppingList; 