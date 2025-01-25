// src/components/Libraries/LibraryEditForm.tsx

import React, { useState } from 'react';
import api from '../../services/api';

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
    <div>
      <h3>Edit Library</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Library Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default LibraryEditForm;
