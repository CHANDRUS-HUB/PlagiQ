import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App';
import Login from './pages/signin';
import Register from './pages/signup';
import Home from './pages/home';
import ForgotPassword from './pages/ForgotPassword';
import Compare from './pages/compare';
import Dashboard from './pages/dashboard';
import AdminStatsTable from './pages/AdminStatsTable';
import PlagarismChecker from './pages/plagarismcheck';
import ProtectedUserRoute from './components/ProtectedUserRoute'; // ⬅️ Import route guard

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "home", element: <Home /> },
      { path: "signin", element: <Login /> },
      { path: "signup", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },

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
        path: "AdminStats",
        element: (
          <ProtectedUserRoute>
            <AdminStatsTable />
          </ProtectedUserRoute>
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
