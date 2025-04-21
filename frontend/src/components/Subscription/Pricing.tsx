import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const plans = [
  {
    title: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Up to 3 libraries',
      'Basic book management',
      'Standard support',
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outlined' as const,
    disabled: true,
  },
  {
    title: 'Pro',
    price: '$9.99',
    period: 'per month',
    features: [
      'Unlimited libraries',
      'Advanced book management',
      'Priority support',
      'Custom book covers',
      'Export functionality',
    ],
    buttonText: 'Subscribe Now',
    buttonVariant: 'contained' as const,
    disabled: false,
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Team management',
      'API access',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outlined' as const,
    disabled: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    if (plan === 'Pro') {
      navigate('/checkout');
    } else if (plan === 'Enterprise') {
      // Handle enterprise contact
      window.location.href = 'mailto:sales@storynook.com';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom>
          Simple, Transparent Pricing
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Choose the plan that's right for you
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.title} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardHeader
                title={plan.title}
                titleTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    {plan.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /{plan.period}
                  </Typography>
                </Box>
                <List>
                  {plan.features.map((feature) => (
                    <ListItem key={feature}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant={plan.buttonVariant}
                  color="primary"
                  onClick={() => handleSubscribe(plan.title)}
                  disabled={plan.disabled}
                >
                  {plan.buttonText}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Pricing;
