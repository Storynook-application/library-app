// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  Container
} from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import RegisterForm from './components/Auth/RegisterForm';
import LoginForm from './components/Auth/LoginForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import LibraryList from './components/Libraries/LibraryList';
import BookList from './components/Books/BookList';
import Pricing from './components/Subscription/Pricing';
import Checkout from './components/Subscription/Checkout';
import CheckoutSuccess from './components/Subscription/CheckoutSuccess';
import CheckoutCancel from './components/Subscription/CheckoutCancel';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// BookList wrapper component
const BookListWrapper = () => {
  const { libraryId } = useParams();
  return <BookList libraryId={parseInt(libraryId || '0')} />;
};

// HomePage component
const HomePage = () => {
  const { token } = useAuth();

  return (
    <Box sx={{
      py: 8,
      px: 2,
      textAlign: 'center',
      maxWidth: '800px',
      mx: 'auto'
    }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to StoryNook
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Your personal digital library management system
      </Typography>
      <Typography variant="body1" paragraph>
        Organize, track, and enjoy your books in one place. Create libraries, add books, and keep track of your reading journey.
      </Typography>
      {!token && (
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
          >
            Login
          </Button>
        </Box>
      )}
      {token && (
        <Button
          component={Link}
          to="/libraries"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4 }}
        >
          Go to My Libraries
        </Button>
      )}
    </Box>
  );
};

// Main App component
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              <Route
                path="/libraries"
                element={
                  <ProtectedRoute>
                    <LibraryList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/libraries/:libraryId/books"
                element={
                  <ProtectedRoute>
                    <BookListWrapper />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
