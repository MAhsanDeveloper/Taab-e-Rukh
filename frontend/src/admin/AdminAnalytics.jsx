/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { motion } from "framer-motion";
import { Users, Package, ShoppingBag } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get("/analytics");
        console.log("Analytics API Response:", data);
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
    return (
      <p className="text-center text-lg animate-pulse">Loading dashboard...</p>
    );
  if (!analytics)
    return (
      <p className="text-center text-red-500">Failed to load analytics.</p>
    );

  const { analyticsData, dailySalesData } = analytics;

  // Stats card data
  const stats = [
    {
      title: "Total Users",
      value: analyticsData?.users ?? 0,
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Products",
      value: analyticsData?.products ?? 0,
      icon: <Package className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Total Sales",
      value: analyticsData?.totalSales ?? 0,
      icon: <ShoppingBag className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Revenue",
      value: `RS. ${(analyticsData?.totalRevenue ?? 0).toLocaleString()}`,
      icon: <span className="text-yellow-600 font-bold">₨</span>,
    },
  ];

  // Chart.js dataset
  const chartData = {
    labels: dailySalesData?.map((d) => d.date) ?? [],
    datasets: [
      {
        label: "Sales",
        data: dailySalesData?.map((d) => d.sales) ?? [],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Revenue",
        data: dailySalesData?.map((d) => d.revenue) ?? [],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { beginAtZero: true } },
    },
  };

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
        <h2 className="text-lg font-semibold mb-4">
          Daily Sales (Last 7 Days)
        </h2>
        <div className="h-[250px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
