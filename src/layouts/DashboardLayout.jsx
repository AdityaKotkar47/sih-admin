import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64, // AppBar height
}));

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleNavigation = () => {
    if (isHome) {
      // If we add more functionality later
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={isHome ? 'menu' : 'back'}
            onClick={handleNavigation}
            edge="start"
            sx={{ mr: 2 }}
          >
            {isHome ? <MenuIcon /> : <ArrowBackIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            SIH Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Main>
        <Outlet />
      </Main>
    </Box>
  );
}

export default DashboardLayout; 