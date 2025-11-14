// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const LoginPageSkeleton = () => {
  return (
    <div className="py-10 px-4 md:px-8 lg:px-16 max-w-screen-md mx-auto">
      <motion.div
        className="bg-gray-50 p-8 lg:p-12 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Loader */}
        <Loader className="animate-spin h-10 w-10 text-gray-800" />
        <p className="text-gray-500 text-lg font-medium">Loading Page...</p>

        {/* Placeholder inputs (gray bars) */}
        <div className="space-y-4 w-full mt-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Placeholder button */}
        <div className="h-12 w-full bg-blue-600 rounded-lg animate-pulse mt-4" />
      </motion.div>
    </div>
  );
};

export default LoginPageSkeleton;
