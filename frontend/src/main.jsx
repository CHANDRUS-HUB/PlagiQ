import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from './App';
import Login from './pages/signin';
import Register from './pages/signup';
import Home from './pages/home';
import ForgotPassword from './pages/ForgotPassword';
import Compare from './pages/compare';
import Dashboard from './pages/dashboard';
import AdminStatsTable from './pages/adminStatsTable';
import PlagarismChecker from './pages/plagarismcheck';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import { AuthProvider, useAuth } from './components/Authcontext';

const GuestRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { 
        index: true, 
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ) 
      },
      { 
        path: "home", 
        element: <Home /> 
      },
      { 
        path: "signin", 
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ) 
      },
      { 
        path: "signup", 
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ) 
      },
      { 
        path: "forgot-password", 
        element: (
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        ) 
      },
      {
        path: "dashboard",
        element: (
          <ProtectedUserRoute>
            <Dashboard />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "plagarismcheck",
        element: (
          <ProtectedUserRoute>
            <PlagarismChecker />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "adminstats", 
        element: (
          <ProtectedAdminRoute>
            <AdminStatsTable />
          </ProtectedAdminRoute>
        ),
      },
      {
        path: "compare",
        element: (
          <ProtectedUserRoute>
            <Compare />
          </ProtectedUserRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);