// src/components/Books/BookForm.tsx

import React, { useState } from 'react';
import api from '../../services/api';

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
}

interface BookFormProps {
  libraryId: number;
  onClose: () => void;
  onCreate: (book: Book) => void;
}

const BookForm: React.FC<BookFormProps> = ({
  libraryId,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [isbn, setIsbn] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [rating, setRating] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(`/libraries/${libraryId}/books`, {
        title,
        author,
        isbn,
        genre,
        rating,
      });
      console.log('Create book success:', response.status, response.data);
      onCreate(response.data);
    } catch (err) {
      setError('Failed to add book.');
      console.error(err);
    }
  };

  return (
    <div>
      <h4>Add New Book</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          ISBN:
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </label>
        <br />
        <label>
          Genre:
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </label>
        <br />
        <label>
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Add Book</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default BookForm;
