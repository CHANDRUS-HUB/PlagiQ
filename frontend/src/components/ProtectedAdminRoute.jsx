import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext"; // adjust path as needed

export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated === false) {
    return <Navigate to="/signin" replace />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
