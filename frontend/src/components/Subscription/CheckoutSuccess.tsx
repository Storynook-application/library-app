import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const CheckoutSuccess = () => {
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
        <CheckCircleIcon
          color="success"
          sx={{ fontSize: 64, mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for subscribing to StoryNook Pro. Your account has been
          upgraded and you now have access to all premium features.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/libraries')}
          >
            Go to My Libraries
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutSuccess;
