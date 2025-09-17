import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Button, TextField, Typography, useTheme } from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';

import { showSnackbar } from '@/common/slices/snackbarSlice';

import { adminLogin } from '../service/auth.service';
import { login } from '../slices/adminAuthSlice';
import { type LoginFormData, schema } from '../types';

const AdminLogin = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await adminLogin(data);
      dispatch(
        login({
          id: res.id,
          email: res.email,
          access_token: res.access_token,
          refresh_token: res.refresh_token,
        }),
      );
      dispatch(showSnackbar({ message: 'Login successful!', severity: 'success' }));
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      dispatch(showSnackbar({ message: 'Login failed. Please try again.', severity: 'error' }));
      reset();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: { xs: 3, md: 4 },
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          width: { xs: '90%', md: '400px' },
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #00ffcc, #b300ff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            '-webkit-text-fill-color': 'transparent',
            mb: 3,
          }}
        >
          Admin Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.divider } },
          }}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.divider } },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            width: '100%',
            borderRadius: 20,
            textTransform: 'none',
            '&:hover': { backgroundColor: theme.palette.primary.dark },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default AdminLogin;
