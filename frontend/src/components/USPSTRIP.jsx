/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Headphones, Package, Users, ShieldCheck } from "lucide-react";

const USPStrip = () => {
  const usps = [
    {
      icon: <Headphones className="w-8 h-8 text-gray-700" />,
      heading: "Customer Service",
      text: "We’re Here When You Need Us",
    },
    {
      icon: <Package className="w-8 h-8 text-gray-700" />,
      heading: "Fast Shipping",
      text: "Get Fast Shipping Orders",
    },
    {
      icon: <Users className="w-8 h-8 text-gray-700" />,
      heading: "24/7 Service",
      text: "Available for Your Query",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gray-700" />,
      heading: "Secure Payment",
      text: "Your Payment Information Is Processed Securely",
    },
  ];

  return (
    <div className="bg-white py-12 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        {usps.map((u, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="mb-3">{u.icon}</div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{u.heading}</h3>
            <p className="text-sm text-gray-600">{u.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default USPStrip;
