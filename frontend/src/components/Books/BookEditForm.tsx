// src/components/Books/BookEditForm.tsx
import React, { useState } from 'react';
import api from '../../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Box,
  Typography,
  Alert,
  Grid,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';

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

interface BookEditFormProps {
  libraryId: number;
  book: Book;
  onClose: () => void;
  onUpdate: (book: Book) => void;
}

const BookEditForm: React.FC<BookEditFormProps> = ({
  libraryId,
  book,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState<string>(book.title);
  const [author, setAuthor] = useState<string>(book.author);
  const [isbn, setIsbn] = useState<string>(book.isbn);
  const [genre, setGenre] = useState<string>(book.genre);
  const [rating, setRating] = useState<number>(book.rating);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [removeCover, setRemoveCover] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('isbn', isbn);
      formData.append('genre', genre);
      formData.append('rating', rating.toString());
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      // In handleSubmit, add:
      if (removeCover) {
        formData.append('removeCover', 'true');
      }
      const response = await api.patch(
        `/libraries/${libraryId}/books/${book.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onUpdate(response.data);
    } catch (err) {
      setError('Failed to update book.');
      console.error(err);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" component="div">
          Edit Book
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                label="Book Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="author"
                label="Author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="isbn"
                label="ISBN"
                name="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="genre"
                label="Genre"
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography component="legend">Rating:</Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue || 1);
                  }}
                  size="large"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Cover Image
                </Typography>

                {book.cover_url && !removeCover && !previewUrl && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      mb: 2,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <img
                      src={book.cover_url}
                      alt="Current cover"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}

                {previewUrl && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      mb: 2,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="New cover preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Upload New Cover Image
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                  />
                </Button>

                {book.cover_url && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={removeCover}
                        onChange={(e) => setRemoveCover(e.target.checked)}
                        color="error"
                      />
                    }
                    label="Remove current cover image"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            px: 3,
            py: 1
          }}
        >
          Update Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookEditForm;
