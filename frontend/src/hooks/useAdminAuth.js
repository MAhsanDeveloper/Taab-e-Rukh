import { useEffect, useState } from "react";
import axios from "axios";

export default function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/auth/check-admin", { withCredentials: true })
      .then(res => setIsAdmin(res.data.isAdmin))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  return { isAdmin, loading };
}