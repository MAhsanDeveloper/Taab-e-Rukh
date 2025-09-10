// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const BillingPageSkeleton = () => {
  return (
    <div className="py-10 px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center lg:text-left animate-pulse">
        Billing & Shipping
      </h1>

      <div className="lg:flex gap-8">
        {/* Left: Form Skeleton */}
        <motion.div
          className="lg:flex-[1.3] order-2 lg:order-1 bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-5 animate-pulse"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg w-full" />
            ))}
          <div className="mt-6 space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg w-full" />
              ))}
          </div>

          {/* Place Order Button */}
          <div className="flex justify-center mt-8">
            <div className="h-12 w-48 bg-gray-300 rounded-lg" />
          </div>
        </motion.div>

        {/* Right: Order Summary Skeleton */}
        <motion.div
          className="lg:flex-[0.7] order-1 lg:order-2 mt-8 lg:mt-0 space-y-4 animate-pulse"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="hidden lg:block sticky top-4 self-start bg-[#FFF8F0] border border-gray-200 p-6 rounded-2xl shadow-md space-y-4">
            <div className="h-6 bg-gray-300 rounded w-32" />
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center h-12 bg-gray-200 rounded-lg px-3"
                >
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                  <div className="h-4 w-12 bg-gray-300 rounded" />
                </div>
              ))}
            <div className="h-6 bg-gray-300 rounded w-20 mt-3" />
          </div>

          {/* Mobile summary (collapsed) */}
          <div className="lg:hidden bg-[#FFF8F0] border border-gray-200 p-4 rounded-lg space-y-2">
            <div className="h-6 bg-gray-300 rounded w-32" />
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between h-10 bg-gray-200 rounded-lg px-3"
                >
                  <div className="h-4 w-20 bg-gray-300 rounded" />
                  <div className="h-4 w-12 bg-gray-300 rounded" />
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingPageSkeleton;
