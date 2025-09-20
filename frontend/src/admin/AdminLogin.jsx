import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useAdminAuth from "../hooks/useAdminAuth";

const adminPanelPath = import.meta.env.VITE_ADMIN_PANEL_PATH;

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const { email, mobileNumber, password } = credentials;
    if (!email && !mobileNumber)
      return toast.error("Please enter email or mobile number");
    if (!password) return toast.error("Please enter password");

    setLoading(true);
    try {
      await axios.post(
        "/auth/admin-login",
        { email, mobileNumber, password },
        { withCredentials: true },
      );
      const res = await axios.get("/auth/check-admin", {
        withCredentials: true,
      });
      if (res.data.isAdmin) {
        await axios.get("/auth/check-admin", { withCredentials: true });
        toast.success("Login successful ✅");
        navigate(adminPanelPath);
      } else {
        toast.error("Access denied. Not an admin.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate(adminPanelPath);
    }
  }, [authLoading, isAdmin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Admin Login
        </h2>

        <div className="space-y-4">
          <input
            name="mobileNumber"
            type="text"
            value={credentials.mobileNumber}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Mobile Number"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" /> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
