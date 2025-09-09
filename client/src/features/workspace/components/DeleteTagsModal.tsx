import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { getWorkspaceById, deleteTags } from "../service/workspace.service";
import type { IWorkspace } from "../types";

interface DeleteTagsModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess: () => void; // refresh parent
  showSnackbar: (msg: string, severity?: "success" | "error") => void;
}

export default function DeleteTagsModal({
  open,
  onClose,
  workspaceId,
  onSuccess,
  showSnackbar,
}: DeleteTagsModalProps) {
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const res = await getWorkspaceById(workspaceId);
      setWorkspace(res);
    } catch {
      showSnackbar("Failed to fetch workspace tags", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && workspaceId) {
      fetchWorkspace();
    }
  }, [open, workspaceId]);

  const handleDelete = async (tag: string) => {
    try {
      const res = await deleteTags(workspaceId, { tags: [tag] }) as {message : string};
      showSnackbar(res.message || `Tag "${tag}" deleted successfully!`);
      fetchWorkspace(); // refresh local tags
      onSuccess(); // refresh parent table
    } catch {
      showSnackbar("Failed to delete tag", "error");
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
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDelete(tag)}
                  >
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
