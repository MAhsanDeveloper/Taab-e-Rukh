import { useEffect, useState } from "react";
import axios from "../lib/axios";
import ProductCarousel from "./ProductCarousel";

const SpotlightCategory = ({ categorySlug }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(`/shop/category/${categorySlug}`);
        setProducts(res.data.products || res.data || []);
      } catch (error) {
        console.error("Error loading spotlight category", error);
        setProducts([]);
      }
    };
    fetchCategoryProducts();
  }, [categorySlug]);

  if (products.length === 0) return null;

  return (
    <div className="my-12 px-4 sm:px-10">
      <h2 className="text-xl font-bold mb-6 capitalize bg-black text-white inline-block px-4 py-2 rounded-full">
        {categorySlug}
      </h2>

      <ProductCarousel products={products} />
    </div>
  );
};

export default SpotlightCategory;
