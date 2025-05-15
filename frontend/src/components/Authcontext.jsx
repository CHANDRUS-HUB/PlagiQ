import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

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
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
