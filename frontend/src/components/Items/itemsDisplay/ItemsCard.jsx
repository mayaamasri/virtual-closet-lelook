import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { MoreVertical } from 'lucide-react';
import { ITEM_STYLES } from './styles';
import { MenuOptions } from './itemsMenuOptions';

const ItemCard = ({ item, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${'http://localhost:4000'}/${cleanPath}`;
  };

  const getCategoryName = (item) => {
    return item.Category?.category_name || item.category_name || 'Uncategorized';
  };

  return (
    <Card sx={ITEM_STYLES.card}>
      <Box sx={ITEM_STYLES.imageContainer}>
        <Box
          component="img"
          src={getImageUrl(item.image_url)}
          alt={item.name}
          sx={ITEM_STYLES.image}
        />
        <IconButton
          sx={ITEM_STYLES.menuButton}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <MoreVertical size={20} />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          {[getCategoryName(item), item.season, item.color].map((label) => (
            <Chip 
              key={label}
              label={label}
              size="small"
              sx={ITEM_STYLES.chip}
            />
          ))}
        </Box>
      </CardContent>

      <MenuOptions
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onEdit={onEdit}
        onDelete={onDelete}
        item={item}
      />
    </Card>
  );
};

export default ItemCard;