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
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  editMembers,
  getCampaignsByWorkspace,
  getWorkspaceById,
} from "../service/workspace.service";
import type { IMemberPermissions, IWorkspace, IWorkspaceUser } from "../types";
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
  const [permissionsState, setPermissionsState] = useState<
    Record<string, IMemberPermissions>
  >({});

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handler to save permissions
  const handleSavePermissions = async (
    workspaceId: string,
    userId: string,
    permissions: IMemberPermissions
  ) => {
    try {
      await editMembers(permissions, workspaceId, userId);
      setSnackbar({
        open: true,
        message: "Permissions updated successfully!",
        severity: "success",
      });
      fetchWorkspace(); // refresh workspace data
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update permissions",
        severity: "error",
      });
    }
  };

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const res = await getWorkspaceById(workspaceId);
      setWorkspace(res);

      // preload permissions state
      const initialPermissions: Record<string, IMemberPermissions> = {};
      res.users.forEach((user) => {
        if (typeof user !== "string") {
          const u = user as IWorkspaceUser;
          const wsPermission = u.workspaces.find(
            (w) => w.workspaceId === workspaceId
          );
          initialPermissions[u._id] = {
            viewer: wsPermission?.permission?.viewer ?? false,
            editor: wsPermission?.permission?.editor ?? false,
            allowAdd: wsPermission?.permission?.allowAdd ?? false,
          };
        }
      });
      setPermissionsState(initialPermissions);
    } catch (err) {
      console.error("Failed to fetch workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && workspaceId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const ws = await getWorkspaceById(workspaceId);
          setWorkspace(ws);

          // preload campaigns
          const cs = await getCampaignsByWorkspace(workspaceId);
          setCampaigns(cs);

          // preload permissions
          const initialPermissions: Record<string, IMemberPermissions> = {};
          ws.users.forEach((user) => {
            if (typeof user !== "string") {
              const u = user as IWorkspaceUser;
              const wsPermission = u.workspaces.find(
                (w) => w.workspaceId === workspaceId
              );
              initialPermissions[u._id] = {
                viewer: wsPermission?.permission?.viewer ?? false,
                editor: wsPermission?.permission?.editor ?? false,
                allowAdd: wsPermission?.permission?.allowAdd ?? false,
              };
            }
          });
          setPermissionsState(initialPermissions);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, workspaceId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const togglePermission = (userId: string, key: keyof IMemberPermissions) => {
    setPermissionsState((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [key]: !prev[userId]?.[key],
      },
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>View Workspace</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Grid textAlign={"center"}>
            <CircularProgress />
          </Grid>
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
                    Created on:{" "}
                    {new Date(workspace.creationDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Creator: {workspace.creator}
                  </Typography>
                </Box>
              )}

              {/* Users */}
              {tab === 1 && (
                <List
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    mt: 1,
                  }}
                >
                  {workspace.users.map((user) => {
                    if (typeof user === "string") return null;
                    const u = user as IWorkspaceUser;
                    const userPermissions = permissionsState[u._id] || {
                      viewer: false,
                      editor: false,
                      allowAdd: false,
                    };

                    return (
                      <ListItem key={u._id} divider>
                        <ListItemText
                          primary={u.name}
                          secondary={
                            <>
                              {u.contactInfo.email} |{" "}
                              {u.contactInfo.countryCode}
                              {u.contactInfo.phoneNo}
                            </>
                          }
                        />

                        {/* Editable permissions */}
                        <Box
                          display="flex"
                          gap={1}
                          flexDirection={{ xs: "column", sm: "row" }}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          flexWrap={"wrap"}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={userPermissions.viewer ?? false}
                                onChange={() =>
                                  togglePermission(u._id, "viewer")
                                }
                              />
                            }
                            label="Viewer"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={userPermissions.editor ?? false}
                                onChange={() =>
                                  togglePermission(u._id, "editor")
                                }
                              />
                            }
                            label="Editor"
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() =>
                              handleSavePermissions(
                                workspaceId,
                                u._id,
                                userPermissions
                              )
                            }
                          >
                            Save
                          </Button>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              )}

              {/* Tags */}
              {tab === 2 && (
                <List
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    mt: 1,
                  }}
                >
                  {workspace.tags.map((tag) => (
                    <ListItem key={tag} divider>
                      <ListItemText primary={tag} />
                    </ListItem>
                  ))}
                </List>
              )}

              {/* Campaigns */}
              {tab === 3 && (
                <List
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    mt: 1,
                  }}
                >
                  {campaigns.length === 0 ? (
                    <Typography>No campaigns found.</Typography>
                  ) : (
                    campaigns.map((c) => (
                      <ListItem key={c.startDate} divider>
                        <ListItemText
                          primary={`${c.name} (${c.status})`}
                          secondary={
                            <>
                              Audience: {c.audienceSize} | Start:{" "}
                              {new Date(c.startDate).toLocaleDateString()} |
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
