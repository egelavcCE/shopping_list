import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  Divider,
  Alert,
  Box,
  Paper,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  ShoppingCart
} from '@mui/icons-material';
import { getSharedList } from '../../utils/shoppingListService';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const SharedList = () => {
  const { listId } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const sharedList = await getSharedList(listId);
        setList(sharedList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [listId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), "d MMMM yyyy, HH:mm", { locale: tr });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Liste yükleniyor...</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          {list.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: 'small', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(list.createdAt)}
            </Typography>
          </Box>
          <Chip 
            icon={<ShoppingCart />} 
            label={`${list.items?.length || 0} Ürün`}
            color="primary"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List>
          {list.items?.map((item) => (
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
      </Paper>
    </Container>
  );
};

export default SharedList; 