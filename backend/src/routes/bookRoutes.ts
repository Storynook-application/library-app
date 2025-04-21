// src/routes/bookRoutes.ts

import { Router } from 'express';
import { pool } from '../db';
import { authenticateUser, AuthenticatedRequest } from '../middleware/authMiddleware';
import multer from 'multer';
import { uploadCoverImage } from '../utils/s3Uploader';
const upload = multer(); // in-memory storage

const bookRouter = Router({ mergeParams: true }); // Enable access to parent route parameters

// Add a book to a library
bookRouter.post('/', upload.single('coverImage'), authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { libraryId } = req.params;
    const { title, author, isbn, genre, rating } = req.body;
    const userId = req.user?.id;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    // Verify library ownership (same as before)
    const library = await pool.query(
      'SELECT * FROM libraries WHERE id = $1 AND user_id = $2',
      [libraryId, userId]
    );
    if (library.rowCount === 0) {
      return res.status(404).json({ error: 'Library not found or not authorized' });
    }

    let coverUrl = null;
    if (req.file) {
      coverUrl = await uploadCoverImage(req.file.buffer, req.file.originalname);
    }

    const newBook = await pool.query(
      'INSERT INTO books (title, author, isbn, genre, rating, library_id, cover_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, author, isbn, genre, rating, libraryId, coverUrl]
    );
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
    const searchQuery = (req.query.search as string) || '';

    // Verify library belongs to user
    const libraryCheck = await pool.query(
      'SELECT * FROM libraries WHERE id = $1 AND user_id = $2',
      [libraryId, userId]
    );
    if (libraryCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Library not found or not authorized' });
    }

    if (!searchQuery) {
      // No search parameter, return all
      const books = await pool.query(
        'SELECT * FROM books WHERE library_id = $1',
        [libraryId]
      );
      return res.json(books.rows);
    }

    // Search parameter present, partial match on title, author, or isbn
    const books = await pool.query(
      `SELECT * FROM books
       WHERE library_id = $1
       AND (
         title ILIKE '%' || $2 || '%'
         OR author ILIKE '%' || $2 || '%'
         OR isbn ILIKE '%' || $2 || '%'
       )`,
      [libraryId, searchQuery]
    );

    return res.json(books.rows);
  } catch (error) {
    console.error('[VIEW BOOKS ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a book
bookRouter.patch('/:bookId', upload.single('coverImage'), authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { libraryId, bookId } = req.params;
    const { title, author, isbn, genre, rating } = req.body;
    const userId = req.user?.id;

    // Verify library ownership...
    const library = await pool.query(
      'SELECT * FROM libraries WHERE id = $1 AND user_id = $2',
      [libraryId, userId]
    );
    if (library.rowCount === 0) {
      return res.status(404).json({ error: 'Library not found or not authorized' });
    }

    // Check if the user wants to remove the cover image
    const removeCover = req.body.removeCover === 'true';
    let coverUrlUpdate = null;
    if (req.file) {
      coverUrlUpdate = await uploadCoverImage(req.file.buffer, req.file.originalname);
    }

    // If removeCover flag is true, force coverUrlUpdate to null
    if (removeCover) {
      coverUrlUpdate = null;
    }

    // Update query – use COALESCE to retain current cover_url if no new file provided
    const updatedBook = await pool.query(
      `UPDATE books
      SET title = $1, author = $2, isbn = $3, genre = $4, rating = $5,
          cover_url = CASE WHEN $6::text IS NOT NULL OR $7::boolean THEN $6::text ELSE cover_url END
      WHERE id = $8 AND library_id = $9 RETURNING *`,
      [title, author, isbn, genre, rating, coverUrlUpdate, removeCover, bookId, libraryId]
    );

    if (updatedBook.rowCount === 0) {
      return res.status(404).json({ error: 'Book not found or not authorized' });
    }

    const insertedBook = updatedBook.rows[0];
    insertedBook.rating = parseFloat(insertedBook.rating);
    res.status(200).json(insertedBook);
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
