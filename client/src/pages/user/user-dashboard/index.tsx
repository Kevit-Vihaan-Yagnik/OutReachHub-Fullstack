import { Outlet } from 'react-router-dom';

import UserProtectedRoute from '@/app/protectedRoutes/UserProtected';
import UserDashboardLayout from '@/pages/user/user-dashboard/components/UserDashboardLayout';

export default function UserDashboardPage() {
  return (
    <UserProtectedRoute>
      <UserDashboardLayout>
        <Outlet />
      </UserDashboardLayout>
    </UserProtectedRoute>
  );
}
