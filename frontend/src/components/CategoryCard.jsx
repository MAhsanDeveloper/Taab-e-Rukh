import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category }) => {
  const isAllProducts = category.slug === "all-products";

  return (
    <Link
      to={isAllProducts ? "/all-products" : `/category/${category.slug}`}
      className={`
        group relative flex-shrink-0 
        w-64 sm:w-72 md:w-80 
        rounded-2xl overflow-hidden transition
        ${isAllProducts ? "h-64 sm:h-72 md:h-96" : "h-56 sm:h-64 md:h-[340px]"}
      `}
    >
      {/* Image section */}
      <div className={`relative w-full rounded-xl overflow-hidden ${isAllProducts ? "h-60 sm:h-56 md:h-72" : "h-52 sm:h-48 md:h-64"}`}>
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Name + Arrow below image */}
      <div className="bg-white px-4 sm:px-5 py-2 sm:py-3 flex items-center justify-between">
        <h3 className="text-gray-800 font-bold text-lg sm:text-xl md:text-2xl">{category.name}</h3>
        <ArrowRight
          className="transition-transform duration-300 group-hover:rotate-90 text-gray-700"
          size={20}
        />
      </div>
    </Link>
  );
};

export default CategoryCard;
