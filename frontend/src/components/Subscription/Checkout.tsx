import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import api from '../../services/api';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a Checkout Session
      const response = await api.post('/create-checkout-session', {
        priceId: 'price_H5ggYwtDq4fbrJ', // Replace with your Stripe Price ID
      });

      const { sessionId } = response.data;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        setError(error.message || 'An error occurred during checkout');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Complete Your Subscription
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You're just one step away from accessing all the premium features of
          StoryNook.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCheckout}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Proceed to Payment'
          )}
        </Button>

        <Button
          variant="text"
          color="inherit"
          onClick={() => navigate('/pricing')}
          sx={{ mt: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default Checkout;
