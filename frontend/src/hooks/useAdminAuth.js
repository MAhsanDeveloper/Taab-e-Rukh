import { useEffect, useState } from "react";
import axios from "../lib/axios";

export default function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAdmin = async () => {
    try {
      const res = await axios.get("/auth/check-admin", { withCredentials: true });
      setIsAdmin(res.data.isAdmin);
    } catch {
      setIsAdmin(false); // interceptor will retry if needed
    } finally {
      setLoading(false);
    }
  };
  checkAdmin();
}, []);


  return { isAdmin, loading };
}
