// src/components/Libraries/LibraryEditForm.tsx

import React, { useState } from 'react';
import api from '../../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Library {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface LibraryEditFormProps {
  library: Library;
  onClose: () => void;
  onUpdate: (library: Library) => void;
}

const LibraryEditForm: React.FC<LibraryEditFormProps> = ({
  library,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState<string>(library.name);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/libraries/${library.id}`, { name });
      onUpdate(response.data);
    } catch (err) {
      setError('Failed to update library.');
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
          Edit Library
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
          <TextField
            required
            fullWidth
            id="name"
            label="Library Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            margin="normal"
          />
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
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LibraryEditForm;
