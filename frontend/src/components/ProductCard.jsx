import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const discountedPrice = product.hasDiscount
    ? (product.price * (100 - product.discountRate)) / 100
    : product.price;

  return (
    <div className="product-card relative inline-block w-full overflow-hidden rounded-xl duration-300 group bg-white">
      {/* Image + text clickable */}
      <Link to={`/item/${product._id}`} className="block">
        {/* Image */}
        <div className="relative h-52 sm:h-52 md:h-60 lg:h-64 w-full overflow-hidden rounded-t-xl bg-gray-50 flex items-center justify-center">
          <img
            src={product.mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
          />

          {product.hasDiscount && (
            <span className="absolute top-3 left-3 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-md">
              {product.discountRate}% OFF
            </span>
          )}

          {/* Mobile Add to Cart Icon */}
          <div className="absolute bottom-2 right-2 sm:hidden">
            <AddToCartButton
              product={product}
              className="bg-black text-white p-2 rounded-full shadow-md hover:bg-emerald-600 transition"
              iconOnly={<ShoppingCart size={18} />}
            />
          </div>
        </div>

        {/* Brand */}
        <p className="text-[10px] sm:text-sm uppercase tracking-wide px-3 sm:px-4 pt-1 sm:pt-2 font-semibold bg-gradient-to-r from-emerald-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          TAAB e RUKH — By S&GR Pvt Ltd
        </p>

        {/* Details */}
        <div className="pt-2 px-3 sm:px-4 pb-4 space-y-1">
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          {/* Hide benefits on mobile */}
          <p className="hidden sm:block text-xs sm:text-sm text-gray-600 whitespace-pre-line line-clamp-3">
            {product.benefits}
          </p>

          <p className="text-xs sm:text-base text-emerald-600 font-medium">
            {product.size} <span className="text-gray-800">{product.sizeUnit}</span>
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2">
            {product.hasDiscount ? (
              <>
                <span
                  className="text-xs sm:text-sm text-gray-500 relative"
                  style={{
                    textDecoration: "line-through",
                    textDecorationColor: "red",
                    textDecorationThickness: "2px",
                    transform: "skewY(-5deg)",
                    display: "inline-block",
                  }}
                >
                  Rs. {product.price.toLocaleString()}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-emerald-600">
                  Rs. {discountedPrice.toFixed(0)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-xl font-extrabold text-emerald-600">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Desktop hover Add to Cart */}
      <div className="absolute top-0 left-0 w-full h-36 sm:h-48 md:h-60 lg:h-64 hidden sm:flex justify-center items-end pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-auto mb-3">
          <AddToCartButton
            product={product}
            className="bg-black text-white hover:bg-white hover:text-black px-4 sm:px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          />
        </div>
      </div>
      {/* Reviews Section */}
      <div className="px-3 sm:px-4 pb-3">
        <StarRating
          averageRating={product.averageRating}
          numReviews={product.numReviews}
          size={14}
        />
      </div>
    </div>
  );
};

export default ProductCard;
