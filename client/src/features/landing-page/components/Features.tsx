import { CheckCircle } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

const FeatureSection = ({ id }: { id?: string }) => {
  const theme = useTheme();

  const features = [
    {
      title: 'Seamless Integration',
      description: 'Connect with your favorite tools and platforms effortlessly.',
      icon: <CheckCircle sx={{ color: '#00ffcc', mr: 1 }} />,
    },
    {
      title: 'Real-Time Analytics',
      description: 'Track your outreach performance with live data insights.',
      icon: <CheckCircle sx={{ color: '#00ffcc', mr: 1 }} />,
    },
    {
      title: 'Custom Campaigns',
      description: 'Create tailored campaigns to engage your target audience.',
      icon: <CheckCircle sx={{ color: '#00ffcc', mr: 1 }} />,
    },
    {
      title: 'Automated Workflows',
      description: 'Streamline your tasks with powerful automation tools.',
      icon: <CheckCircle sx={{ color: '#00ffcc', mr: 1 }} />,
    }, // Replaced duplicate with a new feature
  ];

  return (
    <section id={id}>
      <Box
        sx={{
          py: { xs: 6, md: 10 },
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
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))',
            backdropFilter: 'blur(5px)',
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            px: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #00ffcc, #b300ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              '-webkit-text-fill-color': 'transparent',
              mb: 4,
            }}
          >
            Our Features
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4,
              px: { xs: 2, md: 0 },
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  p: 2,
                  width: { xs: '100%', md: 'calc(50% - 16px)' }, // Two columns on md, full width on xs
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardContent>
                  {feature.icon}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </section>
  );
};

export default FeatureSection;
