import { Box, Typography, Button, useTheme, Grid } from '@mui/material';

const HeroSection = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #121212, #1e1e1e)',
                color: theme.palette.text.primary,
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
            <Box sx={{ position: 'relative', zIndex: 1, padding: { xs: 2, md: 4 } }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #00ffcc, #b300ff)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        '-webkit-text-fill-color': 'transparent',
                        mb: 2,
                    }}
                >
                    Welcome to OutReachHub
                </Typography>
                <Grid sx={{justifyContent : 'center' , display : 'flex'}}>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: '600px',
                            mb: 4,
                            color: theme.palette.text.secondary,
                            textAlign: 'center',
                        }}
                    >
                        Empower your outreach with our all-in-one platform designed to connect, engage, and grow your audience effortlessly.
                    </Typography>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                        padding: '10px 30px',
                        borderRadius: 20,
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    Get Started
                </Button>
            </Box>
        </Box>
    );
};

export default HeroSection;