import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const AddToCartButton = ({ product, className = "" }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!product?._id) return;
    addToCart(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center gap-2 rounded-2xl cursor-pointer px-4 py-2 shadow-md transition-colors duration-500 ease-in-out ${className}`}
    >
      <ShoppingCart className="w-4 h-4" />
      <span>Add to Cart</span>
    </button>
  );
};

export default AddToCartButton;
