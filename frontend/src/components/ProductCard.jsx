import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ProductCard = ({ product, index }) => {
  const discountedPrice = product.hasDiscount
    ? (product.price * (100 - product.discountRate)) / 100
    : product.price;

  const animationProps = {
    initial: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.7, ease: "easeOut" },
  };

  return (
    <motion.div
      {...animationProps}
      className="relative inline-block w-72 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group mr-4"
    >
      {/* Image + text clickable */}
      <Link to={`/item/${product._id}`} className="block">
        <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
          <img
            src={product.mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
          />

          {product.hasDiscount && (
            <span className="absolute top-3 left-3 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
              {product.discountRate}% OFF
            </span>
          )}
        </div>

        <p className="text-xs uppercase tracking-wide px-4 pt-3 font-semibold bg-gradient-to-r from-emerald-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          TAAB e RUKH — By S&GR Pvt Ltd
        </p>

        <div className="pt-3 px-4">
          <h3 className="text-lg font-bold text-black line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-black whitespace-pre-line line-clamp-3">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {product.hasDiscount ? (
              <>
                <span className="text-sm text-black line-through">
                  Rs. {product.price}
                </span>
                <span className="text-xl font-bold text-red-500">
                  Rs. {discountedPrice.toFixed(0)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-red-500">
                Rs. {product.price}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button (outside Link, locked to bottom of image) */}
      <div className="absolute top-0 left-0 w-full h-64 flex justify-center items-end pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-auto mb-3">
          <AddToCartButton
            product={product}
            className="bg-black text-white hover:bg-white hover:text-black px-4 py-2 rounded-lg shadow-md"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
