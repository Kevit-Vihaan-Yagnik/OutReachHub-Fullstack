import {
  Box,
  TextField,
  Typography,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Menu,
  useMediaQuery,
  useTheme,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useMemo, useEffect } from "react";
import type { ICampaign, ICampaignFormData } from "../types";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
  addCampaign,
  setCampaigns,
  setError,
  setLoading,
} from "../slices/campaignSlice";
import {
  createCampaignApi,
  getCampaignsByWorkspace,
} from "../service/campaign.service";
import AddCampaignModal from "./AddCampaignModal";
import ViewCampaignModal from "./ViewCampaignModal";

export default function CampaignTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // menu state for actions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(
    null
  );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const dispatch = useDispatch();
  const { campaigns } = useSelector((state: RootState) => state.campaign);
  const workspaceId = useSelector(
    (state: RootState) => state.userAuth.currentWorkspace?.id
  );

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);

  const handleAddCampaign = async (data: ICampaignFormData) => {
    try {
      if (!workspaceId) {
        console.error("❌ No workspaceId found");
        setSnackbar({
          open: true,
          message: "Workspace not found!",
          severity: "error",
        });
        return;
      }

      const newCampaign = await createCampaignApi(workspaceId, data);

      dispatch(addCampaign(newCampaign));

      setSnackbar({
        open: true,
        message: "✅ Campaign created successfully!",
        severity: "success",
      });

      setOpenAdd(false);
    } catch (err) {
      console.error("❌ Failed to create campaign:", err);
      setSnackbar({
        open: true,
        message: "❌ Failed to create campaign",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!workspaceId) return;
      try {
        dispatch(setLoading(true));
        const data = await getCampaignsByWorkspace(workspaceId);
        dispatch(setCampaigns(data));
      } catch (err: any) {
        console.error("❌ Failed to fetch campaigns:", err);
        dispatch(setError("Failed to load campaigns"));
      }
    };

    fetchCampaigns();
  }, [workspaceId, dispatch]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    campaign: ICampaign
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCampaign(campaign);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // collect unique tags for filter dropdown
  const uniqueTags = Array.from(new Set(campaigns.flatMap((c) => c.tags)));

  // filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTag = !tagFilter || c.tags.includes(tagFilter);
      return matchesSearch && matchesTag;
    });
  }, [campaigns, searchQuery, tagFilter]);

  // slice campaigns for pagination
  const paginatedCampaigns = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredCampaigns.slice(start, start + rowsPerPage);
  }, [filteredCampaigns, page, rowsPerPage]);

  // helper: status chip color
  const getStatusColor = (status: ICampaign["status"]) => {
    switch (status) {
      case "Running":
        return "success";
      case "Completed":
        return "info";
      case "Draft":
      default:
        return "default";
    }
  };

  // helper: format date safely
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Campaigns
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAdd(true)}
        >
          Add Campaign +
        </Button>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: "250px" }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Tag</InputLabel>
          <Select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            label="Filter by Tag"
          >
            <MenuItem value="">All</MenuItem>
            {uniqueTags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="center">Start</TableCell>
              <TableCell align="center">Actions</TableCell>
              {!isMobile && (
                <>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Audience Size</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCampaigns.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell>{campaign.name}</TableCell>
                <TableCell>
                  <Chip
                    label={campaign.status}
                    color={getStatusColor(campaign.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {campaign.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>

                {/* Start Button Column */}
                <TableCell align="center">
                  {campaign.status === "Draft" && (
                    <Button size="small" color="success" variant="contained">
                      Start
                    </Button>
                  )}
                  {campaign.status === "Running" && (
                    <Button size="small" color="success" disabled>
                      Running
                    </Button>
                  )}
                  {campaign.status === "Completed" && (
                    <Button size="small" color="info" disabled>
                      Completed
                    </Button>
                  )}
                </TableCell>

                {/* Actions Column */}
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, campaign)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>

                {!isMobile && (
                  <>
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                    <TableCell>{formatDate(campaign.endDate)}</TableCell>
                    <TableCell>{campaign.audienceSize}</TableCell>
                  </>
                )}
              </TableRow>
            ))}

            {paginatedCampaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={isMobile ? 5 : 8} align="center">
                  No campaigns found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 🔹 Modals */}
        <AddCampaignModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onSubmit={async (formData) => await handleAddCampaign(formData)}
        />

        <ViewCampaignModal
          open={openView}
          onClose={() => {
            setOpenView(false);
            setSelectedCampaign(null);
          }}
          campaignId={selectedCampaign?._id}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredCampaigns.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedCampaign) {
              setOpenView(true);
            }
            handleMenuClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
