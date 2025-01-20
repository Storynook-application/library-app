// src/utils/cleanupTokens.ts

import cron from 'node-cron';
import { pool } from '../db';

// Schedule to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const result = await pool.query(
      'DELETE FROM users WHERE reset_token_expires < $1 AND reset_token IS NOT NULL',
      [now]
    );
    console.log(`[Cleanup] Removed ${result.rowCount} expired reset tokens.`);
  } catch (error) {
    console.error('[Cleanup Tokens Error]', error);
  }
});
