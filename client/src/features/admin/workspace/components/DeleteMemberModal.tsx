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
import { getWorkspaceById, deleteMember } from "../service/workspace.service";
import type { IWorkspace } from "../types";

interface DeleteMembersModalProps {
    open: boolean;
    onClose: () => void;
    workspaceId: string;
    onSuccess: () => void; // refresh parent
    showSnackbar: (msg: string, severity?: "success" | "error") => void;
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

    const fetchWorkspace = async () => {
        try {
            setLoading(true);
            const res = await getWorkspaceById(workspaceId);
            setWorkspace(res);
        } catch {
            showSnackbar("Failed to fetch workspace members", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && workspaceId) {
            fetchWorkspace();
        }
    }, [open, workspaceId]);

    const handleDelete = async (userId: string) => {
        try {
            const res = await deleteMember(workspaceId, userId);
            console.log(res)
            showSnackbar(res.message || "Member deleted successfully!");
            fetchWorkspace(); // refresh local users
            onSuccess(); // refresh parent table
        } catch {
            showSnackbar("Failed to delete member", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Delete Members</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <List>
                        {workspace?.users.map((user) => {
                            if (typeof user === "string") return null; // skip IDs-only

                            // check if user is still a "viewer"
                            const wsMembership = user.workspaces.find(
                                (ws) => ws.workspaceId === workspaceId
                            );
                            if (!wsMembership?.permission.viewer) return null;

                            return (
                                <ListItem
                                    key={user._id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            color="error"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={user.name}
                                        secondary={user.contactInfo.email}
                                    />
                                </ListItem>
                            );
                        })}
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
