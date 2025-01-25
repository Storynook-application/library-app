// src/components/Books/BookEditForm.tsx

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
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.patch(
        `/libraries/${libraryId}/books/${book.id}`,
        {
          title,
          author,
          isbn,
          genre,
          rating,
        }
      );
      onUpdate(response.data);
    } catch (err) {
      setError('Failed to update book.');
      console.error(err);
    }
  };

  return (
    <div>
      <h4>Edit Book</h4>
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
        <button type="submit">Update Book</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default BookEditForm;
