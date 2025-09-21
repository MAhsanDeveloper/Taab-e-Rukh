import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const AddToCartButton = ({ product, className = "", iconOnly = false }) => {
  const { addToCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product?._id) return;

    setLoading(true);
    try {
      // Simulate network delay (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await addToCart(product);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`flex items-center justify-center rounded-2xl cursor-pointer shadow-md transition-colors duration-500 ease-in-out disabled:opacity-70 ${className} ${
        iconOnly ? "p-2" : "px-4 py-2 gap-2"
      }`}
    >
      <ShoppingCart className="w-4 h-4" />
      {!iconOnly && (
        loading ? (
          <span className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </span>
        ) : (
          <span>Add to Cart</span>
        )
      )}
    </button>
  );
};

export default AddToCartButton;
