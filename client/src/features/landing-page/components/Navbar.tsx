import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const navItems = ['Home', 'Features', 'Pricing', 'FAQs'];

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(10px)',
        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: { xs: 1, md: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(90deg, #00ffcc, #b300ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              '-webkit-text-fill-color': 'transparent',
              mr: 2,
            }}
          >
            OutReachHub
          </Typography>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item}
              color="inherit"
              sx={{
                mx: 2,
                fontWeight: 500,
                color: theme.palette.text.primary, // Uses dark mode text color
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'transparent',
                },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            variant="outlined"
            sx={{ mx: 1, borderRadius: 20, textTransform: 'none', '&:hover': { borderColor: theme.palette.primary.main } }}
            onClick={()=>navigate('/user/login')}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;