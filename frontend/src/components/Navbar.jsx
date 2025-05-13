import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { path: "/home", label: "Home" },
  { path: "/signin", label: "Sign In" },
  { path: "/signup", label: "Sign Up" },
];

const userLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/plagarismcheck", label: "Plagiarism Check" },
  { path: "/compare", label: "File Comparison" },
];

const adminLinks = [
  { path: "/admin-dashboard", label: "Admin Dashboard" },  // For Admin
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");  // Track user role
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:7000/check-auth", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUserRole(data.user?.role); 
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/;"; // Clear cookie
    setIsAuthenticated(false);
    setUserRole("");  // Reset role
    navigate("/signin");  // Redirect to sign-in page
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-2xl font-bold text-white">
            PlagiQ
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {/* Display public links if not authenticated */}
            {(!isAuthenticated ? navLinks : userRole === "admin" ? adminLinks : userLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded transition duration-300"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Show logout button only when authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-white hover:text-red-600 px-4 py-2 rounded transition duration-300"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-2 bg-white rounded shadow-md p-4 space-y-2">
            {(!isAuthenticated ? navLinks : userRole === "admin" ? adminLinks : userLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:bg-indigo-500 hover:text-white px-4 py-2 rounded transition duration-300"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left text-gray-700 hover:bg-red-700 hover:text-white px-4 py-2 rounded transition duration-300"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
