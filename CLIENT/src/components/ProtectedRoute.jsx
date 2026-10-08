import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

export function ProtectedRoute({ admin = false, roles = [] }) {
  const location = useLocation();
  const { isAuthenticated, user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return <div className="page"><div className="container section"><div className="skeleton" style={{ height: 160, borderRadius: 8 }} /></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  const allowedRoles = admin ? ["admin"] : roles;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
