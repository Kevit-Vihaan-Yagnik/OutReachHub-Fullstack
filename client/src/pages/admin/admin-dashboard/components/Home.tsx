import { useEffect, useState } from 'react';

import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { analytics } from '../service/analytics.service';
import type { IWorkspace } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

export default function Home() {
  const theme = useTheme();

  const [stats, setStats] = useState([
    { title: 'Workspaces', value: '0' },
    { title: 'Users', value: '0' },
    { title: 'Campaigns', value: '0' },
    { title: 'Revenue', value: '$12.3k' },
  ]);

  const [campaignWorkspaceData, setCampaignWorkspaceData] = useState<
    { name: string; value: number }[]
  >([]);

  const [usersPieData, setUsersPieData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res: IWorkspace[] = await analytics();

        const workspacesCount = res.length;
        const usersCount = res.reduce((acc, w) => acc + w.users.length, 0);
        const campaignsCount = res.reduce((acc, w) => acc + w.campaigns.length, 0);

        // 🔹 Campaigns by Workspace
        const workspaceData = res.map((w) => ({
          name: w.name,
          value: w.campaigns.length,
        }));

        // 🔹 Users by Workspace (Pie Chart)
        const pieData = res.map((w) => ({
          name: w.name,
          value: w.users.length,
        }));

        setStats([
          { title: 'Workspaces', value: workspacesCount.toString() },
          { title: 'Users', value: usersCount.toString() },
          { title: 'Campaigns', value: campaignsCount.toString() },
          { title: 'Revenue', value: '$12.3k' },
        ]);

        setCampaignWorkspaceData(workspaceData);
        setUsersPieData(pieData);
      } catch (err) {
        return err;
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      {/* Title */}
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        Admin Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)',
                color: '#fff',
              }}
              elevation={3}
            >
              <Typography variant="h6" fontWeight={600}>
                {stat.title}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Campaigns by Workspace */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Campaigns by Workspace
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignWorkspaceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill={theme.palette.primary.main} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Users by Workspace (Pie Chart) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Users by Workspace
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={usersPieData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                  {usersPieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
