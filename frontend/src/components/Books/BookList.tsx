// src/components/Books/BookList.tsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import BookForm from './BookForm';
import BookEditForm from './BookEditForm';

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

interface BookListProps {
  libraryId: number;
}

const BookList: React.FC<BookListProps> = ({ libraryId }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Fetch books from /libraries/:libraryId/books
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

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Books in Library {libraryId}</h2>
      <button onClick={() => setShowCreateForm(true)}>Add New Book</button>
      {showCreateForm && (
        <BookForm
          libraryId={libraryId || 0}
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreate}
        />
      )}
      {editBook && (
        <BookEditForm
          libraryId={libraryId || 0}
          book={editBook}
          onClose={() => setEditBook(null)}
          onUpdate={handleUpdate}
        />
      )}
      <ul>
        {books.length > 0 ? (
          books.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author}
              <button onClick={() => setEditBook(book)}>Edit</button>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>
            No books in this library yet. Click "Add New Book" to create one!
          </p>
        )}
      </ul>
    </div>
  );
};

export default BookList;
