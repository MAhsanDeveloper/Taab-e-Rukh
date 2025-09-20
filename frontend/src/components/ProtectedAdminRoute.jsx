import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios
    .get(`/auth/check-admin`)
      .then((res) => setIsAdmin(res.data.isAdmin))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Checking admin access...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedAdminRoute;
