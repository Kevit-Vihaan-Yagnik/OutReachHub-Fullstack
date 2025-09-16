import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import type { RootState } from '@/app/store';
import { setCurrentWorkspace } from '@/pages/user/auth-user/slices/userAuthSlice';

import { getUserDetail } from '../service/dashboard.service';
import type { ICurrentWorkspace, IUserDetail, IUserWorkspaceLink } from '../types';

export default function WorkspacePicker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<IUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.userAuth.user?.id);

  const activeWorkspaces = useMemo(() => {
    if (!detail) return [];
    // Only allow where viewer is true
    return detail.workspaces.filter((w) => w.permission?.viewer !== false);
  }, [detail]);

  useEffect(() => {
    const load = async () => {
      try {
        if (!userId) navigate('/user/login');
        setLoading(true);
        const res = await getUserDetail(userId!);
        setDetail(res);
      } catch {
        setError('Failed to load workspaces');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, userId]);

  // Auto-pick if exactly one active workspace
  useEffect(() => {
    if (!loading && activeWorkspaces.length === 1) {
      const w = activeWorkspaces[0];
      const payload: ICurrentWorkspace = {
        id: w!.workspaceId._id,
        name: w!.workspaceId.name,
        permission: {
          editor: !!w!.permission?.editor,
          viewer: !!w!.permission?.viewer,
          allowAdd: !!w!.permission?.allowAdd,
        },
      };
      dispatch(setCurrentWorkspace(payload));
      navigate('/user/dashboard');
    }
  }, [loading, activeWorkspaces, dispatch, navigate]);

  const handleSelect = (link: IUserWorkspaceLink) => {
    const payload: ICurrentWorkspace = {
      id: link.workspaceId._id,
      name: link.workspaceId.name,
      permission: {
        editor: !!link.permission?.editor,
        viewer: !!link.permission?.viewer,
        allowAdd: !!link.permission?.allowAdd,
      },
    };
    dispatch(setCurrentWorkspace(payload));
    navigate('/user/dashboard');
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!detail || activeWorkspaces.length === 0) {
    return (
      <Box p={4}>
        <Typography>No available workspaces.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Select a workspace
      </Typography>

      <Paper sx={{ borderRadius: 2 }}>
        <List>
          {activeWorkspaces.map((w) => (
            <ListItemButton key={w._id} onClick={() => handleSelect(w)}>
              <ListItemText
                primary={w.workspaceId.name}
                secondary={`Workspace ID: ${w.workspaceId._id}`}
              />
              <Stack direction="row" spacing={1}>
                {w.permission?.editor && <Chip size="small" label="Editor" />}
                {w.permission?.viewer && <Chip size="small" label="Viewer" />}
                {w.permission?.allowAdd && <Chip size="small" label="Can Add" />}
              </Stack>
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
