// routes.tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

import Landing from "@/pages/Landing.Page";
import LoginAdmin from "@/pages/AdminLogin.Page";
import DashboardPage from "@/pages/Dashboard.Page";
import Home from "@/features/admin/admin-dashboard/components/Home";
import Workspace from "@/features/admin/workspace/components/Workspace";
import LoginUser from "@/pages/UserLogin.Page";
import UserDashboardPage from "@/pages/UserDashboard.Page";
import UserHome from "@/features/user/user-dashboard/components/UserHome";
import WorkspacePicker from "@/features/user/user-dashboard/components/WorkspacePicker";
import Contact from "@/features/user/contact/components/Contact";
import MessageTemplate from "@/features/user/message-template/components/MessageTemplate";
import Campaign from "@/features/user/campaign/components/Campaign";

function CatchAllRedirect() {
  const admin = useSelector((state: RootState) => state.adminAuth.admin?.access_token);
  const user = useSelector((state: RootState) => state.userAuth.user?.access_token);

  if (admin) return <Navigate to="/admin/dashboard" replace />;
  if (user) return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/admin/login", element: <LoginAdmin /> },
  {
    path: "/admin/dashboard",
    element: <DashboardPage />,
    children: [
      { path: "", element: <Home /> },
      { path: "workspace", element: <Workspace /> },
    ],
  },
  { path: "/user/login", element: <LoginUser /> },
  { path: "/user/workspace-picker", element: <WorkspacePicker /> },
  {
    path: "/user/dashboard",
    element: <UserDashboardPage />,
    children: [
      { path: "", element: <UserHome /> },
      { path: "contacts", element: <Contact /> },
      { path: "templates", element: <MessageTemplate /> },
      { path: "campaigns", element: <Campaign /> },
    ],
  },
  
  { path: "*", element: <CatchAllRedirect /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
