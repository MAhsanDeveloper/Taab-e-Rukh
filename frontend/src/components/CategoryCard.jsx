import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category }) => {
  const isAllProducts = category.slug === "all-products";

  return (
    <Link
      to={isAllProducts ? "/all-products" : `/category/${category.slug}`}
      className={`group relative flex-shrink-0 w-80 rounded-2xl overflow-hidden transition
        ${isAllProducts ? "h-[400px]" : "h-[340px]"}`}
    >
      {/* Image section */}
      <div className={`relative w-full overflow-hidden ${isAllProducts ? "h-72" : "h-64"}`}>
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Name + Arrow below image */}
      <div className="bg-white px-5 py-3 flex items-center justify-between">
        <h3 className="text-gray-800 font-bold text-2xl">{category.name}</h3>
        <ArrowRight
          className="transition-transform duration-300 group-hover:rotate-90 text-gray-700"
          size={22}
        />
      </div>
    </Link>
  );
};

export default CategoryCard;
