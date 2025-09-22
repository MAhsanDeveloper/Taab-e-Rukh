/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const AllProductsPage = () => {
  const { fetchAllProducts, products } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const processedProducts = products?.map((p) => ({
    ...p,
    mainImage: p.mainImage || "",
  }));

  return (
    <div className="min-h-screen bg-white py-6 overflow-x-hidden">
      {/* Page container */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 lg:px-10">
        <motion.h1
          className="inline-block text-left text-xl sm:text-3xl font-bold text-black bg-white px-6 py-3 rounded-2xl shadow-sm mb-10 hover:bg-black hover:text-white transition-all duration-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          All Products
        </motion.h1>

        {processedProducts?.length === 0 ? (
          <h2 className="text-center"></h2>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {processedProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                animationProps={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, delay: index * 0.05 },
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
