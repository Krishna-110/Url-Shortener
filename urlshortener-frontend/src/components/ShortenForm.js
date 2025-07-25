import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export default function ShortenForm({ onShorten, loading }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiryAt, setExpiryAt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let expiry = expiryAt;
    if (expiry && expiry.length === 16) expiry += ':00'; // Add seconds if missing
    try {
      await onShorten({ originalUrl, expiryAt: expiry || null });
      setOriginalUrl('');
      setExpiryAt('');
    } catch (err) {
      setError(err.message || 'Failed to shorten URL');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Shorten a URL</Typography>
      <TextField
        label="Long URL"
        value={originalUrl}
        onChange={e => setOriginalUrl(e.target.value)}
        fullWidth
        margin="normal"
        required
        autoFocus
        placeholder="Paste your long URL here"
      />
      <TextField
        label="Expiry (optional)"
        type="datetime-local"
        value={expiryAt}
        onChange={e => setExpiryAt(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: expiryAt && (
            <InputAdornment position="end">
              <IconButton onClick={() => setExpiryAt('')} size="small" aria-label="Clear expiry">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
        helperText="Leave empty for no expiry."
        placeholder=""
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        Shorten
      </Button>
    </Box>
  );
} 