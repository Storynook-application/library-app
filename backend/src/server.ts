// backend/src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import xssSanitize from './middleware/xssSanitize';
import rateLimit from 'express-rate-limit'; // Imported express-rate-limit
import authRouter from './routes/auth';
import './utils/cleanupTokens';
import libraryRouter from './routes/libraryRoutes';
import morgan from 'morgan';
import stripeRouter from './routes/stripeRoutes';

dotenv.config();

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  credentials: true, // Allow cookies and authorization headers
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

const app = express();

// Apply Helmet middleware for security headers
app.use(helmet());

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable preflight for all routes
app.options('*', cors(corsOptions));

// Apply body parsing middleware
app.use(express.json());

// Apply express-rate-limit middleware, skipping OPTIONS requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  skip: (req, res) => req.method === 'OPTIONS',
});
app.use(limiter);

// Apply xssSanitize middleware, skipping OPTIONS requests
app.use(xssSanitize);

// Apply morgan middleware for logging
app.use(morgan('combined'));

// Stripe webhook needs raw body
app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

// Define routes
app.use('/auth', authRouter);
app.use('/libraries', libraryRouter);
app.use('/stripe', stripeRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello, you have reached the Library App Backend!');
});

// Bind to all network interfaces to ensure Docker can access it
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
