import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Skeleton,
  Box,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  Snackbar
} from '@mui/material';
import { 
  ShoppingCart, 
  AccessTime,
  Delete,
  ContentCopy,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  RadioButtonUnchecked
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserLists, getShoppingList, replicateList } from '../../utils/shoppingListService';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const HistoryLists = ({ onAddMultipleToList }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedList, setExpandedList] = useState(null);
  const [listDetails, setListDetails] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        const fetchedLists = await getUserLists(user.uid);
        const sortedLists = fetchedLists.sort((a, b) => 
          b.createdAt?.toMillis() - a.createdAt?.toMillis()
        );
        setLists(sortedLists);
      } catch (error) {
        console.error('Listeler alınırken hata:', error);
        setError('Listeler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchLists();
    }
  }, [user]);

  const handleExpandList = async (listId) => {
    if (expandedList === listId) {
      setExpandedList(null);
      return;
    }

    setExpandedList(listId);
    
    if (!listDetails[listId]) {
      try {
        const details = await getShoppingList(listId);
        setListDetails(prev => ({
          ...prev,
          [listId]: details
        }));
      } catch (error) {
        console.error('Liste detayları alınırken hata:', error);
        setSnackbar({
          open: true,
          message: 'Liste detayları alınamadı',
          severity: 'error'
        });
      }
    }
  };

  const handleReplicateList = async (list) => {
    try {
      if (!list.items || list.items.length === 0) {
        const details = await getShoppingList(list.id);
        list = details;
      }

      onAddMultipleToList(list.items);
      
      setSnackbar({
        open: true,
        message: 'Ürünler listeye eklendi!',
        severity: 'success'
      });

      navigate('/cart');
    } catch (error) {
      console.error('Liste kopyalanırken hata:', error);
      setSnackbar({
        open: true,
        message: 'Ürünler eklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), "d MMMM yyyy, HH:mm", { locale: tr });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (lists.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Henüz kaydedilmiş alışveriş listeniz bulunmamaktadır.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Geçmiş Listelerim
      </Typography>

      <Grid container spacing={3}>
        {lists.map((list) => (
          <Grid item xs={12} key={list.id}>
            <Card>
              <CardContent 
                onClick={() => handleExpandList(list.id)}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {list.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 'small', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(list.createdAt)}
                        </Typography>
                      </Box>
                      <Chip 
                        icon={<ShoppingCart sx={{ fontSize: 'small' }} />}
                        label={`${list.itemCount || 0} Ürün`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  {expandedList === list.id ? <ExpandLess /> : <ExpandMore />}
                </Box>
              </CardContent>

              <Collapse in={expandedList === list.id}>
                <Divider />
                {listDetails[list.id] ? (
                  <List>
                    {listDetails[list.id].items?.map((item) => (
                      <ListItem key={item.id}>
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={item.imageUrl !== "Resim Yok" ? item.imageUrl : "/placeholder.png"}
                            alt={item.name}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={`Adet: ${item.quantity}${item.note ? ` • Not: ${item.note}` : ''}`}
                        />
                        <ListItemIcon>
                          {item.completed ? 
                            <CheckCircle color="success" /> : 
                            <RadioButtonUnchecked color="disabled" />
                          }
                        </ListItemIcon>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="rectangular" height={100} />
                  </Box>
                )}
              </Collapse>

              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<ContentCopy />}
                  onClick={() => handleReplicateList(listDetails[list.id] || list)}
                >
                  Listeye Ekle
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<Delete />}
                >
                  Sil
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
    </Container>
  );
};

export default HistoryLists; 