import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
  LockReset as ResetPasswordIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    ...(token
      ? [{ path: '/libraries', label: 'My Libraries', icon: <LibraryIcon /> }]
      : [
          { path: '/login', label: 'Login', icon: <LoginIcon /> },
          { path: '/register', label: 'Register', icon: <RegisterIcon /> },
          { path: '/forgot-password', label: 'Forgot Password', icon: <ResetPasswordIcon /> }
        ]
    )
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          StoryNook
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Link
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    fontWeight: isActive(item.path) ? 'bold' : 'normal'
                  }}
                >
                  {item.label}
                </Link>
              }
            />
          </ListItem>
        ))}
        {token && (
          <ListItem>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText
              primary={
                <Box
                  component="span"
                  onClick={logout}
                  sx={{
                    color: 'error.main',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </Box>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: '.1rem',
              }}
            >
              StoryNook
            </Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      fontWeight: isActive(item.path) ? 700 : 400,
                      borderBottom: isActive(item.path) ? '2px solid white' : 'none',
                      borderRadius: 0,
                      px: 2
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                {token && (
                  <Button
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={logout}
                    sx={{
                      color: 'error.light',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                        color: 'white'
                      }
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
