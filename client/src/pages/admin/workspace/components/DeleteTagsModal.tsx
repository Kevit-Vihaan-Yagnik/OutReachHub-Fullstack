import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import { showSnackbar } from '@/common/slices/snackbarSlice';

import { deleteTags, getWorkspaceById } from '../service/workspace.service';
import type { IWorkspace } from '../types';

interface DeleteTagsModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess: () => void;
}

export default function DeleteTagsModal({
  open,
  onClose,
  workspaceId,
  onSuccess,
}: DeleteTagsModalProps) {
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchWorkspace = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getWorkspaceById(workspaceId);
      setWorkspace(res);
    } catch {
      dispatch(showSnackbar({ message: 'Failed to fetch workspace tags', severity: 'error' }));
    } finally {
      setLoading(false);
    }
  }, [workspaceId, dispatch]);

  useEffect(() => {
    if (open && workspaceId) {
      fetchWorkspace();
    }
  }, [open, workspaceId, fetchWorkspace]);

  const handleDelete = async (tag: string) => {
    try {
      const res = (await deleteTags(workspaceId, { tags: [tag] })) as { message: string };
      dispatch(
        showSnackbar({
          message: res.message || `Tag "${tag}" deleted successfully!`,
          severity: 'success',
        }),
      );
      fetchWorkspace();
      onSuccess();
    } catch {
      dispatch(showSnackbar({ message: 'Failed to delete tag', severity: 'error' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete Tags</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {workspace?.tags.map((tag) => (
              <ListItem
                key={tag}
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleDelete(tag)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={tag} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
