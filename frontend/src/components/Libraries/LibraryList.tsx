// src/components/Libraries/LibraryList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import from 'react-router-dom'
import api from '../../services/api';
import LibraryForm from './LibraryForm';
import LibraryEditForm from './LibraryEditForm';

interface Library {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const LibraryList = () => {
  const navigate = useNavigate(); // <-- For navigation
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
        const response = await api.get('/libraries'); // no search param
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

  // New function to navigate to the books route
  const handleViewBooks = (libraryId: number) => {
    navigate(`/libraries/${libraryId}/books`);
  };

  if (loading) return <p>Loading libraries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Libraries</h2>
      <button onClick={() => setShowCreateForm(true)}>
        Create New Library
      </button>
      {/* Search UI */}
      <div style={{ margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="Search libraries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

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
        <ul>
          {libraries.map((library) => (
            <li key={library.id}>
              <strong>{library.name}</strong>
              <button onClick={() => setEditLibrary(library)}>Edit</button>
              <button onClick={() => handleDelete(library.id)}>Delete</button>
              {/* New View Books button */}
              <button onClick={() => handleViewBooks(library.id)}>
                View Books
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No libraries available. Create one to get started!</p>
      )}
    </div>
  );
};

export default LibraryList;
