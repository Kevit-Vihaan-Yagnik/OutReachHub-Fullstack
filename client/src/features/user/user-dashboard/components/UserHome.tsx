import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/app/store";
import { getWorkspaceById } from "@/features/admin/workspace/service/workspace.service";
import { getCampaignsByWorkspace } from "@/features/user/campaign/service/campaign.service";
import { getContactsByWorkspace } from "@/features/user/contact/service/contact.service";
import type { IWorkspace } from "@/features/admin/workspace/types";
import type { ICampaign } from "@/features/user/campaign/types";
import type { IContact } from "@/features/user/contact/types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { setUserWorkspace } from "../slice/userWorkspaceSlice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9333EA"];

export default function UserDashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state: RootState) => state.userAuth.currentWorkspace
  );

  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentWorkspace?.id) return;
      setLoading(true);
      try {
        const ws = await getWorkspaceById(currentWorkspace.id);
        const cmps = await getCampaignsByWorkspace(currentWorkspace.id);
        const cts = await getContactsByWorkspace(currentWorkspace.id);

        setWorkspace(ws);
        setCampaigns(cmps);
        setContacts(cts);

        dispatch(setUserWorkspace(ws));
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentWorkspace]);

  // 📊 Campaign status distribution
  const campaignStatusData = useMemo(() => {
    const statusMap: Record<string, number> = {};
    campaigns.forEach((c) => {
      statusMap[c.status] = (statusMap[c.status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
  }, [campaigns]);

  // 📊 Contacts grouped by tag
  const contactsByTagData = useMemo(() => {
    const tagMap: Record<string, number> = {};
    contacts.forEach((contact) => {
      contact.tags.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    return Object.entries(tagMap).map(([name, value]) => ({ name, value }));
  }, [contacts]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Title */}
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        {workspace?.name} Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600}>
              Users
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {workspace?.users.length ?? 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600}>
              Campaigns
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {campaigns.length || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600}>
              Contacts
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {contacts.length || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600}>
              Tags
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {workspace?.tags.length ?? 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        {/* Campaign Status Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Campaign Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignStatusData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {campaignStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Contacts by Tag Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Contacts by Tag
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contactsByTagData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor = {{fill : 'transparent'}}/>
                <Bar dataKey="value" fill={theme.palette.primary.main} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Campaigns Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Campaigns Detail
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell align="right">Audience Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.length > 0 ? (
                campaigns.slice(0,5).map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell>
                      {c.startDate ? new Date(c.startDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      {c.endDate ? new Date(c.endDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell align="right">{c.audienceSize ?? 0}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
