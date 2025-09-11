import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
    await axios.post("/auth/logout", {});
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
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
          className="bg-white text-amber-700 font-semibold py-1 px-4 rounded hover:bg-gray-200 transition"
        >
          Logout
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
