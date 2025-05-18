import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/Authcontext";
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        <Outlet />
      </AuthProvider>

    </div>
  );
}

export default App;
