import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ProductCarousel from "../components/ProductCarousel";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

const ProductPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  const processedProducts = products?.map((p) => ({
    ...p,
    mainImage: p.mainImage || "",
  }));

  const skeletons = Array.from({ length: 5 });

  return (
    <div className="min-h-screen bg-white py-3">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {processedProducts?.length > 0 ? (
          <ProductCarousel products={processedProducts} />
        ) : (
          <div className="overflow-x-auto whitespace-nowrap scroll-smooth px-10 py-4 hide-scrollbar">
            {skeletons.map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
