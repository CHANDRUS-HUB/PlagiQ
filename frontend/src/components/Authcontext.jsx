import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:7000/check-auth", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUserRole(data.user?.role || "");
      } else {
        setIsAuthenticated(false);
        setUserRole("");
      }
    } catch {
      setIsAuthenticated(false);
      setUserRole("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:7000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    setIsAuthenticated(false);
    setUserRole("");
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
