import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const AddToCartButton = ({ product, className = "", iconOnly = false }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!product?._id) return;
    addToCart(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center rounded-2xl cursor-pointer shadow-md transition-colors duration-500 ease-in-out ${className} ${
        iconOnly ? "p-2" : "px-4 py-2 gap-2"
      }`}
    >
      <ShoppingCart className="w-4 h-4" />
      {!iconOnly && <span>Add to Cart</span>}
    </button>
  );
};

export default AddToCartButton;
