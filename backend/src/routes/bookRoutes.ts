// src/routes/bookRoutes.ts

import { Router } from 'express';
import { pool } from '../db';
import { authenticateUser, AuthenticatedRequest } from '../middleware/authMiddleware';

const bookRouter = Router({ mergeParams: true }); // Enable access to parent route parameters

// Add a book to a library
bookRouter.post('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
        const { libraryId } = req.params;
        const { title, author, isbn, genre, rating } = req.body;
        const userId = req.user?.id;

        if (!title || !author) {
            return res.status(400).json({ error: 'Title and author are required' });
        }

        // Verify that the library belongs to the user
        const library = await pool.query(
            'SELECT * FROM libraries WHERE id = $1 AND user_id = $2',
            [libraryId, userId]
        );

        if (library.rowCount === 0) {
            return res.status(404).json({ error: 'Library not found or not authorized' });
        }

        const newBook = await pool.query(
            'INSERT INTO books (title, author, isbn, genre, rating, library_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, author, isbn, genre, rating, libraryId]
        );
        // Convert rating from string to float
        const insertedBook = newBook.rows[0];
        insertedBook.rating = parseFloat(insertedBook.rating);

        res.status(201).json(insertedBook);
    } catch (error) {
        console.error('[ADD BOOK ERROR]', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// View books in a library
bookRouter.get('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { libraryId } = req.params;
    const userId = req.user?.id;

    // Verify library belongs to user
    const library = await pool.query(
      'SELECT * FROM libraries WHERE id = $1 AND user_id = $2',
      [libraryId, userId]
    );
    if (library.rowCount === 0) {
      return res.status(404).json({ error: 'Library not found or not authorized' });
    }

    // Get books for that library
    const books = await pool.query(
      'SELECT * FROM books WHERE library_id = $1',
      [libraryId]
    );

    // Map to parse rating
    const parsedBooks = books.rows.map((b) => ({
      ...b,
      rating: parseFloat(b.rating),
    }));

    return res.json(parsedBooks);

  } catch (error) {
    console.error('[VIEW BOOKS ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a book
bookRouter.patch('/:bookId', authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
        const { libraryId, bookId } = req.params;
        const { title, author, isbn, genre, rating } = req.body;
        const userId = req.user?.id;

        // Verify that the library belongs to the user
        const library = await pool.query(
            'SELECT * FROM libraries WHERE id = $1 AND user_id = $2',
            [libraryId, userId]
        );

        if (library.rowCount === 0) {
            return res.status(404).json({ error: 'Library not found or not authorized' });
        }

        const updatedBook = await pool.query(
            'UPDATE books SET title = $1, author = $2, isbn = $3, genre = $4, rating = $5 WHERE id = $6 AND library_id = $7 RETURNING *',
            [title, author, isbn, genre, rating, bookId, libraryId]
        );

        if (updatedBook.rowCount === 0) {
            return res.status(404).json({ error: 'Book not found or not authorized' });
        }

        // Convert rating from string to float
        const insertedBook = updatedBook.rows[0];
        insertedBook.rating = parseFloat(insertedBook.rating);

        res.status(201).json(insertedBook);
    } catch (error) {
        console.error('[UPDATE BOOK ERROR]', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a book
bookRouter.delete('/:bookId', authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
        const { libraryId, bookId } = req.params;
        const userId = req.user?.id;

        // Verify that the library belongs to the user
        const library = await pool.query(
            'SELECT * FROM libraries WHERE id = $1 AND user_id = $2',
            [libraryId, userId]
        );

        if (library.rowCount === 0) {
            return res.status(404).json({ error: 'Library not found or not authorized' });
        }

        const deletedBook = await pool.query(
            'DELETE FROM books WHERE id = $1 AND library_id = $2 RETURNING *',
            [bookId, libraryId]
        );

        if (deletedBook.rowCount === 0) {
            return res.status(404).json({ error: 'Book not found or not authorized' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('[DELETE BOOK ERROR]', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default bookRouter;
