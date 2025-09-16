import { Outlet } from 'react-router-dom';

import AdminProtectedRoute from '@/common/AdminProtected';

import DashboardLayout from '../features/admin/admin-dashboard/components/DashboardLayout';

export default function DashboardPage() {
  return (
    <AdminProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AdminProtectedRoute>
  );
}
