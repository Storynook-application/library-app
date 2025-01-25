import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { sendGraphMail } from '../utils/graphMailer';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';

const authRouter = Router();

// POST /auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user already exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if ((userCheck.rowCount ?? 0) > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 2. Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert the new user
    const insertUser = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2) RETURNING id, email, created_at`,
      [email, passwordHash]
    );

    const newUser = insertUser.rows[0];
    // 4. Return success
    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    // If no user found, return error
    if (userResult.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // userResult.rows[0] is our found user record
    const user = userResult.rows[0];

    // 2. Compare given password with the stored password_hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 3. Create JWT
    //   - Contains userId (and optionally email, roles, etc.)
    //   - Signed with process.env.JWT_SECRET
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }  // token validity, e.g. 1 day
    );

    // 4. Return token + user data (excluding sensitive fields)
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      },
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/forgot-password
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Lookup user
    const userResult = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (userResult.rowCount === 0) {
      // For security, return success message anyway
      return res.json({ message: 'If that email is in our system, a reset link has been sent.' });
    }

    const user = userResult.rows[0];

    // 2. Generate reset token + expiry
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // 3. Store token in DB
    await pool.query(
      'UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE id=$3',
      [resetToken, expiresAt, user.id]
    );

    // 4. Build the reset link (frontend page)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // 5. Compose the email content
    const subject = 'Reset Your Password';
    const body = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Reset</title>
      </head>
      <body>
        <h2>Hello,</h2>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,<br/>StoryNook Support Team</p>
      </body>
      </html>
      `;

    // 6. Send via Microsoft Graph
    await sendGraphMail(email, subject, body);

    return res.json({ message: 'If that email is in our system, a reset link has been sent.' });
  } catch (error) {
    console.error('[FORGOT PASSWORD ERROR]', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Define rate limiter: maximum of 5 requests per 15 minutes
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset attempts from this IP, please try again after 15 minutes.'
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().uuid().required(),
  newPassword: Joi.string().min(6).required(),
});

authRouter.post('/reset-password', resetPasswordLimiter, async (req, res) => {
  try {

    const { error, value } = resetPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token, newPassword } = value;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    // Basic password strength validation (can be enhanced)
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // 1. Validate the reset token
    const now = new Date();
    const userResult = await pool.query(
      'SELECT id, email, reset_token_expires FROM users WHERE reset_token = $1 AND reset_token_expires > $2',
      [token, now]
    );

    if (userResult.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const user = userResult.rows[0];

    // 2. Hash the new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // 3. Update the user's password and clear the reset token
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    console.log(`Password updated for user ID: ${user.id}`);

    // 4. Notify the user that their password has been changed
    const email = user.email;
    const subject = 'Your password has been changed';
    const body = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Reset</title>
      </head>
      <body>
        <h2>Hello,</h2>
        <p>Your password has been successfully changed. If you did not perform this action, please contact our support team immediately.</p>
        <p>Thanks,<br/>StoryNook Support Team</p>
      </body>
      </html>
      `;

    console.log(`Attempting to send password reset confirmation to: ${email}`);
    await sendGraphMail(email, subject, body);
    console.log(`Password reset confirmation email sent to: ${email}`);

    return res.json({ message: 'Your password has been reset successfully.' });
  } catch (error) {
    console.error('[RESET PASSWORD ERROR]', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

export default authRouter;
