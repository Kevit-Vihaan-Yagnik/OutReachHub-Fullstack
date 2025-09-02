import { Box, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        background: 'linear-gradient(135deg, #1e1e1e, #121212)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))',
          backdropFilter: 'blur(5px)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 4, md: 0 },
            mb: 4,
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(90deg, #00ffcc, #b300ff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                '-webkit-text-fill-color': 'transparent',
                mb: 2,
              }}
            >
              OutReachHub
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
              Empowering your outreach with innovative solutions.
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Email: support@outreachhub.com | Phone: +1-800-555-1234
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, mb: 1, fontWeight: 500 }}>
                Company
              </Typography>
              <Link href="#" underline="hover" sx={{ display: 'block', color: theme.palette.text.secondary, mb: 1 }}>
                About Us
              </Link>
              <Link href="#" underline="hover" sx={{ display: 'block', color: theme.palette.text.secondary }}>
                Blog
              </Link>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, mb: 1, fontWeight: 500 }}>
                Support
              </Typography>
              <Link href="#" underline="hover" sx={{ display: 'block', color: theme.palette.text.secondary, mb: 1 }}>
                Help Center
              </Link>
              <Link href="#" underline="hover" sx={{ display: 'block', color: theme.palette.text.secondary }}>
                Contact Us
              </Link>
            </Box>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}
        >
          © {new Date().getFullYear()} OutReachHub. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;