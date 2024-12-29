import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { Close, AddShoppingCart } from '@mui/icons-material';

const FavoriteCard = ({ product, onRemoveFromFavorites, onAddToList }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleAddToList = async () => {
    try {
      await onAddToList(product);
      setSnackbar({
        open: true,
        message: 'Ürün listeye eklendi',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Ürün zaten listede',
        severity: 'warning'
      });
    }
  };

  const handleRemoveFromFavorites = () => {
    onRemoveFromFavorites(product);
    setSnackbar({
      open: true,
      message: 'Ürün favorilerden çıkarıldı',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Card sx={{ 
        maxWidth: 300,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}>
        <CardMedia
          component="img"
          height="200"
          image={product["Resim URL"] !== "Resim Yok" ? product["Resim URL"] : "/placeholder.png"}
          alt={product["Ürün Adı"]}
          sx={{ objectFit: 'contain', p: 2, bgcolor: 'background.paper' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product["Ürün Adı"]}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToList}
            size="small"
          >
            Listeye Ekle
          </Button>
          <IconButton 
            color="error"
            onClick={handleRemoveFromFavorites}
            aria-label="Favorilerden çıkar"
          >
            <Close />
          </IconButton>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FavoriteCard; 