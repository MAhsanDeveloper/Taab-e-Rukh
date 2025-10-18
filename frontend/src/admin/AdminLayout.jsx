import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { Loader2 } from "lucide-react"; // for a small spinning loader icon

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });

      // Clear any local cache if you’re using context or localStorage
      localStorage.removeItem("isAdmin");

      // Optional: Force a hard refresh to fully clear auth state
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-amber-600">
      {/* Hamburger Button */}
      <button
        className="absolute top-4 left-4 z-50 bg-amber-700 text-white px-3 py-2 rounded md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-amber-800 text-white p-6 space-y-4 w-64 md:relative fixed min-h-screen top-0 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="" className="hover:underline">Dashboard</Link>
          <Link to="analytics" className="hover:underline">Analytics</Link>
          <Link to="home-images" className="hover:underline">Manage Home Images</Link>
          <Link to="shop" className="hover:underline">Manage Shop</Link>
          <Link to="contact" className="hover:underline">Manage Contacts</Link>
          <Link to="orders" className="hover:underline">Manage Orders</Link>
          <Link to="categories-section" className="hover:underline">Manage Categories Section</Link>
          <Link to="coupons" className="hover:underline">Manage Coupons</Link>
        </nav>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`w-full flex items-center justify-center gap-2 bg-white text-amber-700 font-semibold py-1 px-4 rounded transition ${
            loggingOut
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-gray-200 cursor-pointer"
          }`}
        >
          {loggingOut ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" /> Logging out...
            </>
          ) : (
            "Logout"
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
