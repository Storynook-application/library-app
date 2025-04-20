import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.text.secondary,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              StoryNook
            </Typography>
            <Typography variant="body2">
              Your personal digital library management system. Organize, track, and enjoy your books in one place.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none', marginBottom: '8px' }}>
                Home
              </Link>
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'none', marginBottom: '8px' }}>
                Login
              </Link>
              <Link to="/register" style={{ color: 'inherit', textDecoration: 'none', marginBottom: '8px' }}>
                Register
              </Link>
              <Link to="/libraries" style={{ color: 'inherit', textDecoration: 'none', marginBottom: '8px' }}>
                My Libraries
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="GitHub">
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2
        }}>
          <Typography variant="body2">
            © {currentYear} StoryNook. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body2">Privacy Policy</Typography>
            </Link>
            <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body2">Terms of Service</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
