import React, { useState } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Tooltip, TextField, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UrlList({ urls, onUpdateExpiry, onDelete, baseUrl }) {
  const [editing, setEditing] = useState(null);
  const [newExpiry, setNewExpiry] = useState('');

  const handleCopy = (shortCode) => {
    navigator.clipboard.writeText(`${baseUrl}/${shortCode}`);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Your Short URLs</Typography>
      <List>
        {urls.map(url => (
          <ListItem key={url.id} divider>
            <ListItemText
              primary={
                <>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    <b>Short:</b> {`${baseUrl}/${url.shortCode}`}
                    <Tooltip title="Copy">
                      <IconButton size="small" onClick={() => handleCopy(url.shortCode)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Original:</b> {url.originalUrl}
                  </Typography>
                </>
              }
              secondary={
                <>
                  <Typography variant="caption">Clicks: {url.clickCount} | Created: {url.createdAt?.slice(0,19).replace('T',' ')}</Typography>
                  <br />
                  <Typography variant="caption">
                    Expiry: {editing === url.id ? (
                      <>
                        <TextField
                          size="small"
                          value={newExpiry}
                          onChange={e => setNewExpiry(e.target.value)}
                          placeholder="YYYY-MM-DDTHH:MM:SS"
                        />
                        <Button size="small" onClick={() => { onUpdateExpiry(url.shortCode, newExpiry); setEditing(null); }}>Save</Button>
                        <Button size="small" onClick={() => setEditing(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        {url.expiryAt || 'Never'}
                        <Button size="small" onClick={() => { setEditing(url.id); setNewExpiry(url.expiryAt || ''); }}>Edit</Button>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => onDelete(url.shortCode)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 