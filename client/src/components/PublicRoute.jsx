// src/components/PublicOnlyRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader className="animate-spin w-6 h-6 text-gray-500" />;
  }

  if (user && user.uid) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
