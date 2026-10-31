import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Route guard. <RequireAuth role="admin"> or <RequireAuth> (any logged-in user)
export default function RequireAuth({ role, children }) {
  const { user, token } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!user || !token) {
    const to = role === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={to} replace state={{ from: location.pathname }} />;
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return children;
}
