// src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRouter from './routes/auth';
import './utils/cleanupTokens'; // Import the cleanup task

dotenv.config();

const app = express();

// Apply Helmet middleware for security headers
app.use(helmet());

app.use(express.json());

app.use('/auth', authRouter);

// In server.ts or app.ts:
app.get('/', (req, res) => {
  res.send('Hello, you have reached the Library App Backend!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
