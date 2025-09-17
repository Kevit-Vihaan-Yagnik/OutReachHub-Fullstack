// Contact.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Search } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import type { RootState } from '@/app/store';
import { showSnackbar } from '@/common/slices/snackbarSlice';
import { useDebounce } from '@/utils/debouncer.util';

import AddContactModal from './components/AddEditContactModal';
import ContactFormModal from './components/AddEditContactModal';
import DeleteConfirmDialog from './components/DeleteContactDialog';
import ViewContactModal from './components/ViewContactModal';
import {
  addContactToWorkspace,
  deleteContactApi,
  getContactsByWorkspace,
  updateContactApi,
} from './service/contact.service';
import {
  addContact,
  deleteContact,
  setContacts,
  setError,
  setLoading,
  updateContact,
} from './slices/contactSlice';
import type { IContact, IContactFormData } from './types';

export default function Contact() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const workspaceId = useSelector((state: RootState) => state.userAuth.currentWorkspace?.id);

  // 🔹 Elements from Redux
  const { contacts, loading, error } = useSelector((state: RootState) => state.contact);
  const permission = useSelector(
    (state: RootState) => state.userAuth.currentWorkspace?.permission.editor,
  );

  //🔹 Workspace tags from Redux
  const tags = useSelector((state: RootState) => state.userWorkspace.tags);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState<IContact[]>(contacts);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<IContact | null>(null);
  const openMenu = Boolean(anchorEl);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!workspaceId) return;
      try {
        dispatch(setLoading(true));
        const res = await getContactsByWorkspace(workspaceId);
        dispatch(setContacts(res));
      } catch {
        dispatch(setError('Failed to fetch contacts'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchContacts();
  }, [workspaceId, dispatch]);

  useEffect(() => {
    const query = debouncedSearchQuery.trim();
    if (!query) {
      setFilteredRows(contacts);
    } else {
      const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredRows(filtered);
    }
    setPage(0);
  }, [debouncedSearchQuery, contacts]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: IContact) => {
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
      dispatch(showSnackbar({ message: 'Contact added successfully!', severity: 'success' }));
    } catch (err) {
      console.error('❌ Failed to add contact:', err);
      dispatch(showSnackbar({ message: 'Contact already exists', severity: 'error' }));
    }
  };

  const handleEditContact = async (data: IContactFormData) => {
    if (!selectedContact) return;

    try {
      if (!workspaceId) return;
      const updated = await updateContactApi(workspaceId, selectedContact._id, data);

      dispatch(updateContact(updated));
      dispatch(showSnackbar({ message: 'Contact updated successfully!', severity: 'success' }));
    } catch {
      dispatch(setError('Failed to update Contact'));
      dispatch(showSnackbar({ message: 'Failed to update contact', severity: 'error' }));
    } finally {
      setOpenEdit(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!workspaceId || !selectedContact) return;

    try {
      const message = await deleteContactApi(workspaceId, selectedContact._id);
      dispatch(deleteContact(selectedContact._id));

      dispatch(showSnackbar({ message, severity: 'success' }));
    } catch {
      dispatch(setError('Failed to delete contact'));
      dispatch(showSnackbar({ message: 'Failed to delete contact', severity: 'error' }));
    } finally {
      setOpenDelete(false);
      setSelectedContact(null);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary">
          Contacts
        </Typography>
        {permission ? (
          <Button variant="contained" onClick={() => setOpenAdd(true)}>
            Add Contact +
          </Button>
        ) : (
          ''
        )}
      </Box>

      {/* Top Filters */}
      <Grid container spacing={2} mb={3}>
        <TextField
          fullWidth
          size="small"
          label="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', marginTop: '2rem' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <b>Profile</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
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
                  <TableCell colSpan={5} align="center" sx={{ color: 'red' }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Avatar src={row.profilePicture as string} alt={row.name} />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.contactInfo.email}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        {row.tags.join(', ')}
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
          // 6. Count is also based on `filteredRows`
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Action Menu (no changes) ... */}
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
        {permission ? (
          <div>
            <MenuItem
              onClick={() => {
                if (menuRow) {
                  setSelectedContact(menuRow);
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
                  setSelectedContact(menuRow);
                  setOpenDelete(true);
                }
                handleMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              Delete
            </MenuItem>
          </div>
        ) : (
          ''
        )}
      </Menu>

      {/* Modals (no changes) ... */}

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

      <ContactFormModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleEditContact}
        availableTags={tags}
        initialData={selectedContact as IContact}
      />

      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteContact}
        contactName={selectedContact?.name || ''}
      />
    </Box>
  );
}
