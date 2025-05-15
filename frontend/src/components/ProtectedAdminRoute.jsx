import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:7000/check-auth", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated && data.user?.role === "admin") {
          setIsAllowed(true);
        }
      } catch (err) {
        console.error("Admin route auth error", err);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return isAllowed ? children : <Navigate to="/signin" replace />;
}
