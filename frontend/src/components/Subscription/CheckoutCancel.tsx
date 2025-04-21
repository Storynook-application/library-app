import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <CancelIcon
          color="error"
          sx={{ fontSize: 64, mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Cancelled
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your payment was cancelled. No charges were made to your account.
          You can try again whenever you're ready.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/checkout')}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/pricing')}
          >
            Back to Pricing
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutCancel;
