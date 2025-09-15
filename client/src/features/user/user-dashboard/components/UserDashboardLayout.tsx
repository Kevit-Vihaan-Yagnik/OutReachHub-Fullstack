import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Campaign, Contacts, Message } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import type { RootState } from '@/app/store';
import { userLogout } from '@/features/user/auth-user/slices/userAuthSlice';

import { userLogoutApi } from '../../auth-user/service/userAuth.service';
import { getUserDetail } from '../service/dashboard.service';
import { clearUserWorkspace } from '../slice/userWorkspaceSlice';
import type { IUserDetail } from '../types';

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const workspaceName = useSelector((state: RootState) => state.userAuth.currentWorkspace?.name);
  const dispatch = useDispatch();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const email = useSelector((state: RootState) => state.userAuth.user?.email);
  const permissions = useSelector(
    (state: RootState) => state.userAuth.currentWorkspace?.permission,
  );
  const userId = useSelector((state: RootState) => state.userAuth.user?.id);
  const [hasMultipleWorkspaces, setHasMultipleWorkspaces] = React.useState(false);

  React.useEffect(() => {
    const loadWorkspaces = async () => {
      if (!userId) return;
      try {
        const detail: IUserDetail = await getUserDetail(userId);
        const activeWorkspaces = detail.workspaces.filter((w) => w.permission?.viewer !== false);
        setHasMultipleWorkspaces(activeWorkspaces.length > 1);
      } catch (err) {
        console.error('Failed to load workspaces', err);
      }
    };
    loadWorkspaces();
  }, [userId]);

  const handleLogout = async () => {
    if (userId) {
      const data = {
        userId: userId,
      };
      await userLogoutApi(data);
    }
    dispatch(userLogout());
    dispatch(clearUserWorkspace());
    navigate('/user/login');
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          OutReachHub
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton onClick={() => navigate('/user/dashboard')}>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/user/dashboard/contacts')}>
          <ListItemIcon>
            <Contacts color="primary" />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/user/dashboard/templates')}>
          <ListItemIcon>
            <Message color="primary" />
          </ListItemIcon>
          <ListItemText primary="Message Templates" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/user/dashboard/campaigns')}>
          <ListItemIcon>
            <Campaign color="primary" />
          </ListItemIcon>
          <ListItemText primary="Campaigns" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 1,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left side: menu + workspace name */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {workspaceName}
            </Typography>
          </Box>

          {/* Right side: user info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {permissions &&
              Object.entries(permissions)
                .filter(([, value]) => value)
                .map(([key]) => (
                  <Chip key={key} label={key} size="small" color="primary" variant="outlined" />
                ))}
            <Typography variant="body2" sx={{ ml: 2, fontWeight: 500 }}>
              {email}
            </Typography>

            {hasMultipleWorkspaces && (
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 2 }}
                onClick={() => navigate('/user/workspace-picker')}
              >
                Switch Workspace
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (Sidebar) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // space for AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
