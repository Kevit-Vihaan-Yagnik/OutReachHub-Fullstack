import AdminProtectedRoute from "@/common/AdminProtected";
import DashboardLayout from "../features/admin-dashboard/components/DashboardLayout";
import Home from "../features/admin-dashboard/components/Home";
import { Outlet } from "react-router-dom";

export default function DashboardPage() {


  return (
    <AdminProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AdminProtectedRoute>
  );
}
