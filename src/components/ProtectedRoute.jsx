// src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { token, loading, hydrated } = useAuth();

  // Wait until AuthContext finishes loading
  if (loading || !hydrated) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
}

export default ProtectedRoute;