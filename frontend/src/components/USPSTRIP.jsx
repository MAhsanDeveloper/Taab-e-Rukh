import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
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

  const [currentIndex, setCurrentIndex] = useState(0);

  // auto-rotate every 3s on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % usps.length);
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white py-12 relative z-10">
      {/* Desktop / tablet grid */}
      <div className="hidden md:grid grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
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

   {/* Mobile carousel */}
<div className="md:hidden flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl shadow-sm min-h-[180px]">
  <AnimatePresence mode="wait">
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl shadow-sm"
    >
      <div className="mb-3">{usps[currentIndex].icon}</div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        {usps[currentIndex].heading}
      </h3>
      <p className="text-sm text-gray-600">{usps[currentIndex].text}</p>
    </motion.div>
  </AnimatePresence>

  {/* Pagination Dots */}
  <div className="flex justify-center space-x-2 mt-4">
    {usps.map((_, i) => (
      <span
        key={i}
        className={`w-2 h-2 rounded-full transition ${
          i === currentIndex ? "bg-gray-900" : "bg-gray-400"
        }`}
      ></span>
    ))}
  </div>
</div>

    </div>
  );
};

export default USPStrip;
