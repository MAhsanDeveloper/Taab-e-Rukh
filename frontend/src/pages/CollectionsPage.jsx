/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "Hair Care", slug: "hair-care" },
  { name: "Skin Care", slug: "skin-care" },
  { name: "Face & Glow", slug: "face-glow" },
  { name: "Body & Baby", slug: "body-baby" },
];

const CollectionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-left w-fit text-xl sm:text-3xl font-bold text-black bg-white px-5 py-4 rounded-4xl mb-10 hover:bg-black hover:text-white transition-all duration-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Collections
        </motion.h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white text-black rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              <Link to={`/category/${cat.slug}`} className="w-full text-center font-semibold text-lg">
                {cat.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
