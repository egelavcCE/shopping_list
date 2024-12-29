import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import FavoriteCard from './FavoriteCard';
import { useAuth } from '../../contexts/AuthContext';

const Favorites = ({ favorites, onRemoveFromFavorites, onAddToList }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Favorileri görüntülemek için giriş yapmalısınız.
        </Alert>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Henüz favorilere eklenen ürün bulunmamaktadır.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Favorilerim
      </Typography>

      <Grid container spacing={3}>
        {favorites.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <FavoriteCard
              product={product}
              onRemoveFromFavorites={onRemoveFromFavorites}
              onAddToList={onAddToList}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites; 