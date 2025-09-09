import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  // Handle discount
  const hasDiscount = item.hasDiscount;
  const discountRate = item.discountRate || 0;
  const price = item.price || 0;

  const discountedPrice = hasDiscount
    ? (price * (100 - discountRate)) / 100
    : price;

  // Image fix
  const imageUrl =
    item.mainImage?.startsWith("http")
      ? item.mainImage
      : `${import.meta.env.VITE_API_BASE_URL}${item.mainImage}`;

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* Product Image */}
        <div className="shrink-0">
          <img
            src={imageUrl}
            alt={item.name}
            className="h-24 w-24 md:h-32 md:w-32 rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-lg font-semibold text-white hover:text-emerald-400 transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {item.description}
          </p>

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(item.cartItemId)}
            className="flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            <Trash size={16} /> Remove
          </button>
        </div>

        {/* Price + Quantity */}
        <div className="flex flex-col items-end gap-3">
          {/* Price */}
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-base text-gray-400 line-through">
                  Rs. {price}
                </span>
                <span className="text-xl font-bold text-emerald-400">
                  Rs. {discountedPrice.toFixed(0)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-emerald-400">
                Rs. {price}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                updateQuantity(item.cartItemId, item.quantity - 1)
              }
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-emerald-500 hover:text-white transition-colors duration-200"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-[24px] text-center text-white font-medium">
              {item.quantity}
            </span>

            <button
              onClick={() =>
                updateQuantity(item.cartItemId, item.quantity + 1)
              }
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-emerald-500 hover:text-white transition-colors duration-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
