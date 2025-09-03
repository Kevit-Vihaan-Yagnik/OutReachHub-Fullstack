// Contact.tsx
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
  Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import type { RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addContactToWorkspace,
  getContactsByWorkspace,
} from "../service/contact.service";
import {
  setContacts,
  setLoading,
  setError,
  addContact,
} from "../slices/contactSlice";
import type { IContact, IContactFormData } from "../types";
import AddContactModal from "./AddContactModal";
import ViewContactModal from "./ViewContactModal";

export default function Contact() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const workspaceId = useSelector(
    (state: RootState) => state.userAuth.currentWorkspace?.id
  );

  // 🔹 Contacts from Redux
  const { contacts, loading, error } = useSelector(
    (state: RootState) => state.contact
  );

  //🔹 Workspace tags from Redux
  const tags = useSelector((state: RootState) => state.userWorkspace.tags);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState<IContact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<IContact | null>(null);
  const openMenu = Boolean(anchorEl);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // 🔹 Fetch contacts from API on mount
  useEffect(() => {
    const fetchContacts = async () => {
      if (!workspaceId) return;
      try {
        dispatch(setLoading(true));
        const res = await getContactsByWorkspace(workspaceId);
        dispatch(setContacts(res));
      } catch (err: any) {
        dispatch(setError(err.message || "Failed to fetch contacts"));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchContacts();
  }, [workspaceId, dispatch]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    row: IContact
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleAddContact = async (data: IContactFormData) => {
    if (!workspaceId) return;

    try {
      const newContact = await addContactToWorkspace(workspaceId, data);
      dispatch(addContact(newContact));
      setSnackbar({
        open: true,
        message: "Contact added successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Failed to add contact:", err);
      setSnackbar({
        open: true,
        message: "Contact already exists",
        severity: "error",
      });
    }
  };

  const visibleRows = filteredRows.length ? filteredRows : contacts;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        Contacts
      </Typography>

      {/* Top Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            disablePortal
            options={contacts.map((c) => c.name)}
            value={searchQuery}
            onInputChange={(_, newValue) => setSearchQuery(newValue)}
            renderInput={(params) => <TextField {...params} label="Contact" />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} p={1}>
          <Button
            variant="contained"
            onClick={() => {
              if (!searchQuery.trim()) {
                setFilteredRows(contacts);
              } else {
                setFilteredRows(
                  contacts.filter((c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                );
              }
              setPage(0);
            }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => setOpenAdd(true)}
          >
            Add +
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden", marginTop: "2rem" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <b>Profile</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <b>Tags</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "red" }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <Avatar src={row.profilePicture} alt={row.name} />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.contactInfo.email}</TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        {row.tags.join(", ")}
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
          count={visibleRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            if (menuRow) {
              setSelectedContactId(menuRow._id);
              setOpenView(true);
            }
            handleMenuClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>

      {/* Modals */}

      <AddContactModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={(data) => {
          handleAddContact(data);
        }}
        availableTags={tags}
      />

      <ViewContactModal
        open={openView}
        onClose={() => setOpenView(false)}
        contactId={selectedContactId}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
