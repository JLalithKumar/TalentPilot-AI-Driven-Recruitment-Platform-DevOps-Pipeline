import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../store';

// Redirects to /login if user is not authenticated
export const ProtectedRoute = ({ role }: { role?: string }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect to correct dashboard if wrong role
    return <Navigate to={user?.role === 'RECRUITER' ? '/recruiter' : '/candidate'} replace />;
  }

  return <Outlet />;
};

// Redirects to dashboard if user IS authenticated (for login/register pages)
export const GuestOnlyRoute = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (token && user) {
    return <Navigate to={user.role === 'RECRUITER' ? '/recruiter' : '/candidate'} replace />;
  }

  return <Outlet />;
};
