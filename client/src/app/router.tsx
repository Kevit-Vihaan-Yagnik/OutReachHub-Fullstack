// routes.tsx
import { useSelector } from 'react-redux';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import type { RootState } from '@/app/store';
import DashboardPage from '@/pages/admin/admin-dashboard';
import Home from '@/pages/admin/admin-dashboard/components/Home';
import LoginAdmin from '@/pages/admin/auth';
import Workspace from '@/pages/admin/workspace';
import Landing from '@/pages/landing-page';
import LoginUser from '@/pages/user/auth-user';
import Campaign from '@/pages/user/campaign';
import Contact from '@/pages/user/contact';
import MessageTemplate from '@/pages/user/message-template';
import UserDashboardPage from '@/pages/user/user-dashboard';
import UserHome from '@/pages/user/user-dashboard/components/UserHome';
import WorkspacePicker from '@/pages/user/user-dashboard/components/WorkspacePicker';

function CatchAllRedirect() {
  const admin = useSelector((state: RootState) => state.adminAuth.admin?.access_token);
  const user = useSelector((state: RootState) => state.userAuth.user?.access_token);

  if (admin) return <Navigate to="/admin/dashboard" replace />;
  if (user) return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/admin/login', element: <LoginAdmin /> },
  {
    path: '/admin/dashboard',
    element: <DashboardPage />,
    children: [
      { path: '', element: <Home /> },
      { path: 'workspace', element: <Workspace /> },
    ],
  },
  { path: '/user/login', element: <LoginUser /> },
  { path: '/user/workspace-picker', element: <WorkspacePicker /> },
  {
    path: '/user/dashboard',
    element: <UserDashboardPage />,
    children: [
      { path: '', element: <UserHome /> },
      { path: 'contacts', element: <Contact /> },
      { path: 'templates', element: <MessageTemplate /> },
      { path: 'campaigns', element: <Campaign /> },
    ],
  },

  { path: '*', element: <CatchAllRedirect /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
