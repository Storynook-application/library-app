// src/components/Books/BookList.tsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import BookForm from './BookForm';
import BookEditForm from './BookEditForm';
import placeholderCover from '../../assets/images/placeholder-cover.png';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Paper,
  Rating,
  Fab,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  rating: number;
  library_id: number;
  created_at: string;
  updated_at: string;
  cover_url?: string;
}

interface BookListProps {
  libraryId: number;
}

const BookList: React.FC<BookListProps> = ({ libraryId }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/libraries/${libraryId}/books`);
        setBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (libraryId) {
      fetchBooks();
    }
  }, [libraryId]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await api.get(
        `/libraries/${libraryId}/books${queryParam}`
      );
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/libraries/${libraryId}/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      setError('Failed to delete book.');
      console.error(err);
    }
  };

  const handleCreate = (newBook: Book) => {
    setBooks([...books, newBook]);
    setShowCreateForm(false);
  };

  const handleUpdate = (updatedBook: Book) => {
    setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    setEditBook(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Library Collection
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setShowCreateForm(true)}
        >
          <AddIcon />
        </Fab>
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
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{ minWidth: 120 }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {showCreateForm && (
        <BookForm
          libraryId={libraryId}
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreate}
        />
      )}

      {editBook && (
        <BookEditForm
          libraryId={libraryId}
          book={editBook}
          onClose={() => setEditBook(null)}
          onUpdate={handleUpdate}
        />
      )}

      <Grid container spacing={3}>
        {books.length > 0 ? (
          books.map((book) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={book.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition:
                    'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={book.cover_url || placeholderCover}
                  alt={`${book.title} cover`}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    noWrap
                    title={book.title}
                  >
                    {book.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    title={book.author}
                  >
                    {book.author}
                  </Typography>
                  <Rating
                    value={book.rating}
                    readOnly
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Box
                    sx={{
                      mt: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <IconButton size="small" onClick={() => setEditBook(book)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(book.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No books in this library yet. Click the "+" button to add one!
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default BookList;
