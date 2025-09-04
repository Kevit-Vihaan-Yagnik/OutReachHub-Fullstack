import { Box, Typography, Card, CardContent, CardActions, Button, useTheme } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const PricingSection = () => {
  const theme = useTheme();

  const plans = [
    {
      title: 'Basic',
      price: '$9',
      features: ['1 User', '50 Campaigns', 'Basic Analytics', 'Email Support'],
      recommended: false,
    },
    {
      title: 'Pro',
      price: '$19',
      features: ['5 Users', '200 Campaigns', 'Advanced Analytics', 'Priority Support'],
      recommended: true,
    },
    {
      title: 'Enterprise',
      price: '$49',
      features: ['Unlimited Users', 'Unlimited Campaigns', 'Custom Analytics', '24/7 Support'],
      recommended: false,
    },
  ];

  return (
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
      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: { xs: 2, md: 4 } }}>
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
          Pricing Plans
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
          {plans.map((plan, index) => (
            <Card
              key={index}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                p: 2,
                width: { xs: '100%', md: 'calc(33.33% - 16px)' }, // Approx 1/3 width minus gap
                border: plan.recommended ? `2px solid ${theme.palette.primary.main}` : 'none',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent>
                {plan.recommended && (
                  <Typography
                    variant="caption"
                    sx={{
                      background: theme.palette.primary.main,
                      color: '#fff',
                      px: 1,
                      py: 0.5,
                      borderRadius: 4,
                      mb: 2,
                      display: 'inline-block',
                    }}
                  >
                    Recommended
                  </Typography>
                )}
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                  {plan.title}
                </Typography>
                <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main }}>
                  {plan.price}/mo
                </Typography>
                {plan.features.map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ color: '#00ffcc', mr: 1, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    width: '80%',
                    borderRadius: 20,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: theme.palette.primary.dark },
                  }}
                >
                  Select Plan
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PricingSection;