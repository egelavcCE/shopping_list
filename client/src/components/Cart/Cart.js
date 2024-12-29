import React, { useState } from 'react';
import {
  Container,
  Typography,
  List,
  Box,
  Button,
  Paper,
  Divider,
  Alert,
  Snackbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Share, Save } from '@mui/icons-material';
import CartItem from './CartItem';
import { useAuth } from '../../contexts/AuthContext';
import { createShoppingList, updateShoppingListItems, updateListSharing } from '../../utils/shoppingListService';

const Cart = ({ items, setItems }) => {
  const { isAuthenticated, user } = useAuth();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
  };

  const handleUpdateNote = (itemId, note) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, note } : item
    );
    setItems(updatedItems);
  };

  const handleToggleComplete = (itemId, completed) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, completed: !completed } : item
    );
    setItems(updatedItems);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
  };

  const summary = items.reduce((acc, item) => ({
    totalItems: acc.totalItems + 1,
    totalQuantity: acc.totalQuantity + (item.quantity || 1),
    completedItems: acc.completedItems + (item.completed ? 1 : 0)
  }), { totalItems: 0, totalQuantity: 0, completedItems: 0 });

  const handleSaveDialogOpen = () => {
    setSaveDialogOpen(true);
    setListName('');
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
  };

  const handleSave = async () => {
    try {
      // Yeni liste oluştur
      const listId = await createShoppingList(user.uid, listName || 'Yeni Liste');
      
      // Listeye ürünleri kaydet
      await updateShoppingListItems(listId, items);
      
      setSnackbar({
        open: true,
        message: 'Liste başarıyla kaydedildi!',
        severity: 'success'
      });
      handleSaveDialogClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleShare = async () => {
    try {
      // Önce listeyi kaydet
      const listId = await createShoppingList(user.uid, 'Paylaşılan Liste');
      await updateShoppingListItems(listId, items);
      await updateListSharing(listId, true);

      // Paylaşım URL'ini oluştur
      const shareUrl = `${window.location.origin}/share/${listId}`;
      
      // WhatsApp paylaşım URL'ini oluştur
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Alışveriş Listem:\n${shareUrl}`
      )}`;

      // WhatsApp'ı aç
      window.open(whatsappUrl, '_blank');

      setSnackbar({
        open: true,
        message: 'Liste paylaşım için hazırlandı',
        severity: 'success'
      });
    } catch (error) {
      console.error('Liste paylaşılırken hata:', error);
      setSnackbar({
        open: true,
        message: 'Liste paylaşılırken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Alışveriş listesini görüntülemek için giriş yapmalısınız.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Alışveriş Listem
      </Typography>

      {items.length === 0 ? (
        <Alert severity="info">
          Henüz listeye eklenen ürün bulunmamaktadır.
        </Alert>
      ) : (
        <>
          <List>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onUpdateNote={handleUpdateNote}
                onToggleComplete={handleToggleComplete}
                onRemove={handleRemoveItem}
              />
            ))}
          </List>

          <Paper sx={{ p: 3, mt: 4 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Liste Özeti
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>
                Toplam Ürün Sayısı: {summary.totalItems}
              </Typography>
              <Typography>
                Toplam Ürün Adedi: {summary.totalQuantity}
              </Typography>
              <Typography>
                Alınan Ürün Sayısı: {summary.completedItems}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveDialogOpen}
                fullWidth
                disabled={items.length === 0}
              >
                Kaydet
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
                fullWidth
              >
                Paylaş
              </Button>
            </Box>
          </Paper>

          <Dialog open={saveDialogOpen} onClose={handleSaveDialogClose}>
            <DialogTitle>Listeyi Kaydet</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Liste Adı"
                fullWidth
                variant="outlined"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Yeni Liste"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSaveDialogClose}>İptal</Button>
              <Button onClick={handleSave} variant="contained">
                Kaydet
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={snackbar.severity}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};

export default Cart; 