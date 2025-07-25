import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import ShortenForm from './components/ShortenForm';
import UrlList from './components/UrlList';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181a1b',
      paper: '#23272f',
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
});

const API_BASE = 'http://localhost:8080';

function App() {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    const res = await fetch(API_BASE + '/api/urls');
    const data = await res.json();
    setLoading(false);
    setUrls(Array.isArray(data) ? data : []);
  };

  const handleShorten = async ({ originalUrl, expiryAt }) => {
    setLoading(true);
    await fetch(API_BASE + '/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl, expiryAt })
    });
    setLoading(false);
    fetchUrls();
  };

  const handleUpdateExpiry = async (shortCode, expiryAt) => {
    setLoading(true);
    await fetch(`${API_BASE}/api/urls/${shortCode}/expiry`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiryAt })
    });
    setLoading(false);
    fetchUrls();
  };

  const handleDelete = async (shortCode) => {
    setLoading(true);
    await fetch(`${API_BASE}/api/urls/${shortCode}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    setLoading(false);
    fetchUrls();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 6 }}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              URL Shortener
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Shorten your links. Share them anywhere.
            </Typography>
            <ShortenForm onShorten={handleShorten} loading={loading} />
            {loading ? <CircularProgress sx={{ mt: 4 }} /> : <UrlList urls={urls} onUpdateExpiry={handleUpdateExpiry} onDelete={handleDelete} baseUrl="http://localhost:8080" />}
            <Box mt={4}>
              <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()} URL Shortener
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
