// src/routes/libraryRoutes.ts

import { Router } from 'express';
import { pool } from '../db';
import { authenticateUser, AuthenticatedRequest } from '../middleware/authMiddleware';
import bookRouter from './bookRoutes'; // Import bookRouter

const libraryRouter = Router();

// Create a new library
libraryRouter.post('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
        const { name } = req.body;
        const userId = req.user?.id;

        if (!name) {
            return res.status(400).json({ error: 'Library name is required' });
        }

        const newLibrary = await pool.query(
            'INSERT INTO libraries (name, user_id) VALUES ($1, $2) RETURNING *',
            [name, userId]
        );

        res.status(201).json(newLibrary.rows[0]);
    } catch (error) {
        console.error('[CREATE LIBRARY ERROR]', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch all libraries for a user
libraryRouter.get('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const searchQuery = (req.query.search as string) || ''; // can be empty

    // If searchQuery is empty, just get all libraries
    if (!searchQuery) {
      const result = await pool.query(
        'SELECT * FROM libraries WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.json(result.rows); // always an array
    }

    // If there's a search parameter, do a partial match on name (case-insensitive)
    // Using ILIKE in Postgres for case-insensitive pattern matching
    const result = await pool.query(
      `SELECT * FROM libraries
       WHERE user_id = $1 AND name ILIKE '%' || $2 || '%'
       ORDER BY created_at DESC`,
      [userId, searchQuery]
    );

    return res.json(result.rows); // still an array
  } catch (error) {
    console.error('[FETCH LIBRARIES ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Update a library name
libraryRouter.patch('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({ error: 'Library name is required' });
    }

    const updatedLibrary = await pool.query(
      'UPDATE libraries SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, id, userId]
    );

    if (updatedLibrary.rowCount === 0) {
      return res.status(404).json({ error: 'Library not found or not authorized' });
    }

    res.json(updatedLibrary.rows[0]);
  } catch (error) {
    console.error('[UPDATE LIBRARY ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a library
libraryRouter.delete('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const deletedLibrary = await pool.query(
            'DELETE FROM libraries WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deletedLibrary.rowCount === 0) {
            return res.status(404).json({ error: 'Library not found or not authorized' });
        }

        res.json({ message: 'Library deleted successfully' });
    } catch (error) {
        console.error('[DELETE LIBRARY ERROR]', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// **Mount the bookRouter under /libraries/:libraryId/books**
libraryRouter.use('/:libraryId/books', bookRouter);

export default libraryRouter;
