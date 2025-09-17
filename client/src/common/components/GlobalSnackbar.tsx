import { useDispatch, useSelector } from 'react-redux';

import { Alert, Snackbar } from '@mui/material';

import type { RootState } from '@/app/store';
import { hideSnackbar } from '@/common/slices/snackbarSlice';

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: RootState) => state.snackbar);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
