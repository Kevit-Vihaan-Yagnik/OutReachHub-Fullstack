import { Outlet } from 'react-router-dom';

import UserProtectedRoute from '@/common/UserProtected';
import UserDashboardLayout from '@/features/user/user-dashboard/components/UserDashboardLayout';

export default function UserDashboardPage() {
  return (
    <UserProtectedRoute>
      <UserDashboardLayout>
        <Outlet />
      </UserDashboardLayout>
    </UserProtectedRoute>
  );
}
