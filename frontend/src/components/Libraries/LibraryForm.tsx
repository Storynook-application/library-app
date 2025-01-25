// src/components/Libraries/LibraryForm.tsx

import React, { useState } from 'react';
import api from '../../services/api';

interface Library {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface LibraryFormProps {
  onClose: () => void;
  onCreate: (library: Library) => void;
}

const LibraryForm: React.FC<LibraryFormProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/libraries', { name });
      onCreate(response.data);
    } catch (err) {
      setError('Failed to create library.');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Create New Library</h3>
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
        <button type="submit">Create</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default LibraryForm;
