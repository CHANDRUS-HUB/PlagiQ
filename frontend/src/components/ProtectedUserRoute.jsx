import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext"; // adjust path as needed

export default function ProtectedUserRoute({ children }) {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (isAuthenticated === false) {
    return <Navigate to="/signin" replace />;
  }

 

  return children;
}
