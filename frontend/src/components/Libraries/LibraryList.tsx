// src/components/Libraries/LibraryList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LibraryForm from './LibraryForm';
import LibraryEditForm from './LibraryEditForm';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LibraryBooks as LibraryBooksIcon,
} from '@mui/icons-material';

interface Library {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const LibraryList = () => {
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [editLibrary, setEditLibrary] = useState<Library | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        setLoading(true);
        const response = await api.get('/libraries');
        setLibraries(response.data);
      } catch (err) {
        setError('Failed to fetch libraries.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await api.get(`/libraries${queryParam}`);
      setLibraries(response.data);
    } catch (err) {
      setError('Failed to fetch libraries.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/libraries/${id}`);
      setLibraries(libraries.filter((lib) => lib.id !== id));
    } catch (err) {
      setError('Failed to delete library.');
      console.error(err);
    }
  };

  const handleCreate = (newLibrary: Library) => {
    setLibraries([...libraries, newLibrary]);
    setShowCreateForm(false);
  };

  const handleUpdate = (updatedLibrary: Library) => {
    setLibraries(
      libraries.map((lib) =>
        lib.id === updatedLibrary.id ? updatedLibrary : lib
      )
    );
    setEditLibrary(null);
  };

  const handleViewBooks = (libraryId: number) => {
    navigate(`/libraries/${libraryId}/books`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Your Libraries
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateForm(true)}
        >
          Create New Library
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search libraries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: 120 }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {showCreateForm && (
        <LibraryForm
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreate}
        />
      )}

      {editLibrary && (
        <LibraryEditForm
          library={editLibrary}
          onClose={() => setEditLibrary(null)}
          onUpdate={handleUpdate}
        />
      )}

      {libraries.length > 0 ? (
        <Grid container spacing={3}>
          {libraries.map((library) => (
            <Grid item xs={12} sm={6} md={4} key={library.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LibraryBooksIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                      {library.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(library.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<LibraryBooksIcon />}
                    onClick={() => handleViewBooks(library.id)}
                  >
                    View Books
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    size="small"
                    onClick={() => setEditLibrary(library)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(library.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No libraries available. Create one to get started!
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LibraryList;
