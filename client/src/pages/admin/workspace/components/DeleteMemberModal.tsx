import { useCallback, useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions as ConfirmActions,
  DialogContent as ConfirmContent,
  Dialog as ConfirmDialog,
  DialogTitle as ConfirmTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';

import { deleteMember, getWorkspaceById } from '../service/workspace.service';
import type { IWorkspace } from '../types';

interface DeleteMembersModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess: () => void; // refresh parent
  showSnackbar: (msg: string, severity?: 'success' | 'error') => void;
}

export default function DeleteMembersModal({
  open,
  onClose,
  workspaceId,
  onSuccess,
  showSnackbar,
}: DeleteMembersModalProps) {
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');

  const fetchWorkspace = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      const res = await getWorkspaceById(workspaceId);
      setWorkspace(res);
    } catch {
      showSnackbar('Failed to fetch workspace members', 'error');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, showSnackbar]);

  useEffect(() => {
    if (open && workspaceId) {
      fetchWorkspace();
    }
  }, [open, workspaceId, fetchWorkspace]);

  const confirmDelete = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedUserId) return;
    try {
      const res = await deleteMember(workspaceId, selectedUserId);
      showSnackbar(res.message || 'Member deleted successfully!');
      fetchWorkspace();
      onSuccess();
    } catch {
      showSnackbar('Failed to delete member', 'error');
    } finally {
      setConfirmOpen(false);
      setSelectedUserId(null);
      setSelectedUserName('');
    }
  };

  const handleBulkDelete = async () => {
    if (!workspace) return;
    try {
      const viewerUsers = workspace.users.filter(
        (user) =>
          typeof user !== 'string' &&
          user.workspaces.some((ws) => ws.workspaceId === workspaceId && ws.permission.viewer),
      );

      for (const user of viewerUsers) {
        if (typeof user !== 'string') {
          await deleteMember(workspaceId, user._id);
        }
      }

      showSnackbar('All eligible members deleted successfully!');
      fetchWorkspace();
      onSuccess();
    } catch {
      showSnackbar('Failed to delete all members', 'error');
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const filteredUsers = workspace?.users.filter((user) => {
    if (typeof user === 'string') return false;
    const term = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) || user.contactInfo.email.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Delete Members</DialogTitle>
        <DialogContent>
          <TextField
            label="Search members"
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
                mt: 1,
              }}
            >
              <List>
                {filteredUsers.map((user) => {
                  if (typeof user === 'string') return null;

                  const wsMembership = user.workspaces.find((ws) => ws.workspaceId === workspaceId);
                  if (!wsMembership?.permission.viewer) return null;

                  return (
                    <ListItem
                      key={user._id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => confirmDelete(user._id, user.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={user.name} secondary={user.contactInfo.email} />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No members found.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
          <Button
            onClick={() => setBulkConfirmOpen(true)}
            color="error"
            variant="contained"
            disabled={!workspace || workspace.users.length === 0}
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single delete confirmation */}
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <ConfirmTitle>Confirm Delete</ConfirmTitle>
        <ConfirmContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedUserName}</strong> from this workspace?
            This action cannot be undone.
          </Typography>
        </ConfirmContent>
        <ConfirmActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Delete
          </Button>
        </ConfirmActions>
      </ConfirmDialog>

      {/* Bulk delete confirmation */}
      <ConfirmDialog open={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)}>
        <ConfirmTitle>Confirm Bulk Delete</ConfirmTitle>
        <ConfirmContent>
          <Typography>
            Are you sure you want to delete <strong>all eligible members</strong> from this
            workspace? This action cannot be undone.
          </Typography>
        </ConfirmContent>
        <ConfirmActions>
          <Button onClick={() => setBulkConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleBulkDelete} color="error" variant="contained">
            Delete All
          </Button>
        </ConfirmActions>
      </ConfirmDialog>
    </>
  );
}
