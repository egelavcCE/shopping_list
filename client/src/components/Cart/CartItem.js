import React, { useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  TextField,
  Box,
  Checkbox,
  ButtonGroup,
  Button,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onUpdateNote, 
  onToggleComplete, 
  onRemove 
}) => {
  const [note, setNote] = useState(item.note || '');

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleNoteBlur = () => {
    if (note !== item.note) {
      onUpdateNote(item.id, note);
    }
  };

  return (
    <ListItem
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        p: 2,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: { xs: '100%', sm: 'auto' },
        mb: { xs: 2, sm: 0 }
      }}>
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            src={item["Resim URL"] !== "Resim Yok" ? item["Resim URL"] : "/placeholder.png"}
            alt={item["Ürün Adı"]}
            sx={{ width: 56, height: 56 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={item["Ürün Adı"]}
          sx={{ ml: 2 }}
        />
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        flex: 1,
        ml: { xs: 0, sm: 2 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Adet:
          </Typography>
          <ButtonGroup size="small">
            <Button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </Button>
            <Button disabled sx={{ px: 2 }}>
              {item.quantity}
            </Button>
            <Button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <AddIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        </Box>

        <TextField
          size="small"
          placeholder="Not ekle..."
          value={note}
          onChange={handleNoteChange}
          onBlur={handleNoteBlur}
          sx={{ flex: 1 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Checkbox
            checked={item.completed}
            onChange={() => onToggleComplete(item.id, item.completed)}
          />
          <IconButton 
            edge="end" 
            onClick={() => onRemove(item.id)}
            color="error"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  );
};

export default CartItem; 