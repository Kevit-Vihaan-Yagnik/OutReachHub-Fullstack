import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getCampaignsByWorkspace, getWorkspaceById } from "../service/workspace.service";
import type { IWorkspace, IWorkspaceUser } from "../types";
import type { ICampaignRow } from "../types/campaign";

interface ViewWorkspaceModalProps {
    open: boolean;
    onClose: () => void;
    workspaceId: string;
}

export default function ViewWorkspaceModal({
    open,
    onClose,
    workspaceId,
}: ViewWorkspaceModalProps) {
    const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);
    const [campaigns, setCampaigns] = useState<ICampaignRow[]>([]);

    useEffect(() => {
        if (open && workspaceId) {
            const fetchData = async () => {
                try {
                    const ws = await getWorkspaceById(workspaceId);
                    setWorkspace(ws);
                    console.log(ws)
                    const cs = await getCampaignsByWorkspace(workspaceId);
                    setCampaigns(cs);
                } catch (err) {
                    console.log(err)
                }
            };
            fetchData();
        }
    }, [open, workspaceId]);

    const fetchWorkspace = async () => {
        try {
            setLoading(true);
            const res = await getWorkspaceById(workspaceId);
            setWorkspace(res);
        } catch (err) {
            console.error("Failed to fetch workspace:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && workspaceId) {
            fetchWorkspace();
        }
    }, [open, workspaceId]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>View Workspace</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : workspace ? (
                    <>
                        {/* Tabs */}
                        <Tabs value={tab} onChange={handleTabChange}>
                            <Tab label="Overview" />
                            <Tab label="Users" />
                            <Tab label="Tags" />
                            <Tab label="Campaigns" />
                        </Tabs>

                        <Box sx={{ mt: 2 }}>
                            {/* Overview */}
                            {tab === 0 && (
                                <Box>
                                    <Typography variant="h6">{workspace.name}</Typography>
                                    <Typography>{workspace.description}</Typography>
                                    <Typography variant="body2" sx={{ mt: 2 }}>
                                        Created on: {new Date(workspace.creationDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Creator: {workspace.creator}
                                    </Typography>
                                </Box>
                            )}

                            {/* Users */}
                            {tab === 1 && (
                                <List>
                                    {workspace.users.map((user) => {
                                        if (typeof user === "string") return null;
                                        const u = user as IWorkspaceUser;

                                        // find the workspace-specific permissions
                                        const wsPermission = u.workspaces.find((w) => w.workspaceId === workspaceId);

                                        return (
                                            <ListItem key={u._id}>
                                                <ListItemText
                                                    primary={u.name}
                                                    secondary={
                                                        <>
                                                            {u.contactInfo.email} | {u.contactInfo.countryCode}{u.contactInfo.phoneNo}
                                                            <br />
                                                            Permissions:
                                                            {wsPermission ? (
                                                                <>
                                                                    {wsPermission.permission.viewer && " Viewer"}
                                                                    {wsPermission.permission.editor && " | Editor"}
                                                                    {wsPermission.permission.allowAdd && " | Can Add"}
                                                                </>
                                                            ) : (
                                                                " No permissions found"
                                                            )}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}

                                </List>
                            )}

                            {/* Tags */}
                            {tab === 2 && (
                                <List>
                                    {workspace.tags.map((tag) => (
                                        <ListItem key={tag}>
                                            <ListItemText primary={tag} />
                                        </ListItem>
                                    ))}
                                </List>
                            )}

                            {/* Campaigns */}
                            {tab === 3 && (
                                <List>
                                    {campaigns.length === 0 ? (
                                        <Typography>No campaigns found.</Typography>
                                    ) : (
                                        campaigns.map((c) => (
                                            <ListItem key={c.startDate} divider>
                                                <ListItemText
                                                    primary={`${c.name} (${c.status})`}
                                                    secondary={
                                                        <>
                                                            Audience: {c.audienceSize} |
                                                            Start: {new Date(c.startDate).toLocaleDateString()} |
                                                            End: {new Date(c.endDate).toLocaleDateString()}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            )}

                        </Box>
                    </>
                ) : (
                    <Typography>No data available</Typography>
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
