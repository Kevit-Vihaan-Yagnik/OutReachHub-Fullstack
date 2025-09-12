import {
    Autocomplete,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    useTheme,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Snackbar,
    Alert,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import {
    addMembers,
    addTags,
    createWorkspace,
    updateWorkspaceApi,
    workspaces,
} from "../service/workspace.service";
import type { IWorkspaceFormData, IAddMembersDto, IWorkspaceRow } from "../types";
import FormModal from "./FormModal";
import AddMemberModal from "./AddMemberForm";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
    addWorkspace,
    setError,
    setLoading,
    setWorkspaces,
    updateWorkspace,
} from "../slices/workspaceAdminSlice";
import EditWorkspaceModal from "./EditWorkspaceForm";
import AddTagsModal from "./AddTagsForm";
import DeleteMembersModal from "./DeleteMemberModal";
import DeleteTagsModal from "./DeleteTagsModal";
import ViewWorkspaceModal from "./ViewWorkspaceModal";


export default function Workspace() {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openModal, setOpenModal] = useState(false);
    const [openAddMember, setOpenAddMember] = useState(false);
    const [workspaceId, setWorkspaceId] = useState("");
    const dispatch = useDispatch();
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspaceRow | null>(null);
    const [openAddTags, setOpenAddTags] = useState(false);
    const [openDeleteMembers, setOpenDeleteMembers] = useState(false);
    const [openDeleteTags, setOpenDeleteTags] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState<IWorkspaceRow[]>([]);

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuRow, setMenuRow] = useState<IWorkspaceRow | null>(null);
    const openMenu = Boolean(anchorEl);

    const { workspaces: rows, loading } = useSelector(
        (state: RootState) => state.adminWorkspace
    );

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                dispatch(setLoading(true));
                const res = await workspaces();
                dispatch(setWorkspaces(res));
            } catch (error: any) {
                dispatch(setError(error.message || "Failed to fetch workspaces"));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchWorkspaces();
    }, [dispatch]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleAddWorkspace = async (data: IWorkspaceFormData) => {
        try {
            const newWs = await createWorkspace(data);
            dispatch(addWorkspace(newWs));
            showSnackbar("Workspace created successfully!");
        } catch {
            showSnackbar("Failed to create workspace", "error");
        }
    };

    const handleAddMember = async (data: IAddMembersDto) => {
        try {
            if (!workspaceId) return;
            await addMembers(data, workspaceId);
            const res = await workspaces();
            dispatch(setWorkspaces(res));
            showSnackbar("Member added successfully!");
        } catch {
            showSnackbar("Failed to add member , Member already exists", "error");
        }
    };

    const handleEditWorkspace = async (data: { id: string; name: string; description: string }) => {
        try {
            const res = await updateWorkspaceApi(data.id, {
                name: data.name,
                description: data.description,
            });
            const existing = rows.find((w) => w.id === data.id);
            if (existing) {
                const updated = {
                    ...existing,
                    name: data.name,
                    description: data.description,
                };
                dispatch(updateWorkspace(updated));
            }
            showSnackbar(res.message || "Workspace updated successfully!");
        } catch {
            showSnackbar("Failed to update workspace", "error");
        }
    };

    const handleAddTags = async (tags: string[]) => {
        if (!selectedWorkspace) return;
        try {
            await addTags(selectedWorkspace.id, { tags });
            // refresh workspaces
            const res = await workspaces();
            dispatch(setWorkspaces(res));
            showSnackbar("Tags added successfully!");
        } catch (err) {
            console.error("Failed to add tags:", err);
            showSnackbar("Failed to add tags", "error");
        }
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: IWorkspaceRow) => {
        setAnchorEl(event.currentTarget);
        setMenuRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRow(null);
    };

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: theme.palette.background.default,
                minHeight: "100vh",
            }}
        >
            <Typography variant="h4" fontWeight={700} mb={3} color="primary">
                Workspace
            </Typography>

            {/* Top Filters */}
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        disablePortal
                        options={rows.map((row) => row.name)}
                        value={searchQuery}
                        onInputChange={(_, newValue) => setSearchQuery(newValue)}
                        renderInput={(params) => <TextField {...params} label="Workspace" />}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} p={1}>
                    <Button variant="contained" onClick={() => {
                        if (!searchQuery.trim()) {
                            setFilteredRows(rows);
                        } else {
                            setFilteredRows(rows.filter((r) =>
                                r.name.toLowerCase().includes(searchQuery.toLowerCase())
                            ));
                        }
                        setPage(0);
                    }}>Search</Button>
                    <Button variant="contained" sx={{ ml: 2 }} onClick={() => setOpenModal(true)}>
                        Add +
                    </Button>
                </Grid>
            </Grid>

            {/* Table */}
            <Paper sx={{ borderRadius: 2, overflow: "hidden", marginTop: "4rem" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <b>Name</b>
                                </TableCell>
                                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                                    <b>Description</b>
                                </TableCell>
                                <TableCell align="center">
                                    <b>Users</b>
                                </TableCell>
                                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                                    <b>Created</b>
                                </TableCell>
                                <TableCell>
                                    <b>Actions</b>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (filteredRows.length ? filteredRows : rows)
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                {row.description}
                                            </TableCell>
                                            <TableCell align="center">{row.users || 0}</TableCell>
                                            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                {new Date(row.creationDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={rows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />

                {/* Modals */}
                <FormModal open={openModal}
                    onClose={() => setOpenModal(false)}
                    onSubmit={handleAddWorkspace} />
                <AddMemberModal
                    open={openAddMember}
                    onClose={() => setOpenAddMember(false)}
                    onSubmit={handleAddMember}
                />
                <EditWorkspaceModal
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    workspace={selectedWorkspace}
                    onSubmit={handleEditWorkspace}
                />
                <AddTagsModal
                    open={openAddTags}
                    onClose={() => setOpenAddTags(false)}
                    onSubmit={(tags) => {
                        handleAddTags(tags)
                    }}
                />
                <DeleteMembersModal
                    open={openDeleteMembers}
                    onClose={() => setOpenDeleteMembers(false)}
                    workspaceId={workspaceId}
                    onSuccess={async () => {
                        const res = await workspaces();
                        dispatch(setWorkspaces(res));
                    }}
                    showSnackbar={showSnackbar}
                />
                <DeleteTagsModal
                    open={openDeleteTags}
                    onClose={() => setOpenDeleteTags(false)}
                    workspaceId={workspaceId}
                    onSuccess={async () => {
                        const res = await workspaces();
                        dispatch(setWorkspaces(res));
                    }}
                    showSnackbar={showSnackbar}
                />
                <ViewWorkspaceModal
                    open={openView}
                    onClose={() => setOpenView(false)}
                    workspaceId={workspaceId}
                />

            </Paper>

            {/* Action Menu */}
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                <MenuItem
                    onClick={() => {
                        if (menuRow) {
                            setWorkspaceId(menuRow.id);
                            setOpenView(true);
                        }
                        handleMenuClose();
                    }}
                >
                    View
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (menuRow) {
                            setSelectedWorkspace(menuRow);
                            setOpenEdit(true);
                        }
                        handleMenuClose();
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (menuRow) {
                            setWorkspaceId(menuRow.id);
                            setOpenAddMember(true);
                        }
                        handleMenuClose();
                    }}
                >
                    Add Members
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (menuRow) {
                            setSelectedWorkspace(menuRow);
                            setOpenAddTags(true);
                        }
                        handleMenuClose();
                    }}
                >
                    Add Tags
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (menuRow) {
                            setWorkspaceId(menuRow.id);
                            setOpenDeleteMembers(true);
                        }
                        handleMenuClose();
                    }}
                >
                    Delete Members
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setWorkspaceId(menuRow!.id);
                        setOpenDeleteTags(true);
                    }}
                >
                    Delete Tags
                </MenuItem>
            </Menu>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
