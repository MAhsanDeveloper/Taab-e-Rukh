// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ProductCardSkeleton = () => {
  return (
    <motion.div
      className="relative inline-block w-72 overflow-hidden rounded-xl shadow-lg mr-4 animate-pulse"
    >
      {/* Image skeleton */}
      <div className="relative h-64 w-full bg-gray-200 rounded-t-xl"></div>

      {/* Title/brand skeleton */}
      <div className="mt-3 px-4">
        <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-36 bg-gray-300 rounded mb-2"></div>

        {/* Price skeleton */}
        <div className="flex items-center gap-3 mt-2">
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
          <div className="h-5 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Add to Cart button skeleton */}
      <div className="absolute top-0 left-0 w-full h-64 flex justify-center items-end">
        <div className="mb-3 h-10 w-28 bg-gray-300 rounded-lg"></div>
      </div>
    </motion.div>
  );
};

export default ProductCardSkeleton;
