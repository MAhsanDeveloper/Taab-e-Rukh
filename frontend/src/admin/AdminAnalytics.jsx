/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
     const { data } = await axios.get("/analytics");
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return <p className="text-center text-lg animate-pulse">Loading dashboard...</p>;
  if (!analytics)
    return <p className="text-center text-red-500">Failed to load analytics.</p>;

  const { analyticsData, dailySalesData } = analytics;

  // Stats card data
  const stats = [
    {
      title: "Total Users",
      value: analyticsData.users,
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Products",
      value: analyticsData.products,
      icon: <Package className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Total Sales",
      value: analyticsData.totalSales,
      icon: <ShoppingBag className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Revenue",
      value: `Rs ${analyticsData.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition"
          >
            <div className="p-3 rounded-xl bg-gray-100">{stat.icon}</div>
            <div>
              <h3 className="text-gray-600 text-sm">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-2xl shadow-md"
      >
        <h2 className="text-lg font-semibold mb-4">Daily Sales (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4F46E5"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
