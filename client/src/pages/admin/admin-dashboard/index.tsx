import { Outlet } from 'react-router-dom';

import AdminProtectedRoute from '@/app/protectedRoutes/AdminProtected';

import DashboardLayout from './components/DashboardLayout';

export default function DashboardPage() {
  return (
    <AdminProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AdminProtectedRoute>
  );
}
