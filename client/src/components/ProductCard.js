import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Tooltip
} from '@mui/material';
import { Favorite, AddShoppingCart } from '@mui/icons-material';

const ProductCard = ({ product, onAddToList, onAddToFavorites, isAuthenticated }) => {
  const handleAction = (action) => {
    if (!isAuthenticated) {
      return;
    }
    action(product);
  };

  return (
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
        <Tooltip title={!isAuthenticated ? "Giriş yapmanız gerekiyor" : "Listeye Ekle"}>
          <span>
            <Button
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={() => handleAction(onAddToList)}
              size="small"
              disabled={!isAuthenticated}
            >
              Listeye Ekle
            </Button>
          </span>
        </Tooltip>
        <Tooltip title={!isAuthenticated ? "Giriş yapmanız gerekiyor" : "Favorilere Ekle"}>
          <span>
            <IconButton
              color="secondary" 
              onClick={() => handleAction(onAddToFavorites)}
              disabled={!isAuthenticated}
              aria-label="Favorilere ekle"
            >
              <Favorite />
            </IconButton>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 