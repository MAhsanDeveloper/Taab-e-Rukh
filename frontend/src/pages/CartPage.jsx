import { Minus, Plus, Trash } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, coupon, isCouponApplied } =
    useCartStore();

  const navigate = useNavigate();

  // --- Calculate Subtotal (without discounts) ---
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // --- Calculate Total (with product discounts) ---
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.price || 0;
    const discountRate = item.discountRate || 0;

    const discountedPrice = item.hasDiscount
      ? (price * (100 - discountRate)) / 100
      : price;

    return acc + discountedPrice * item.quantity;
  }, 0);

  const savings = cartSubtotal - cartTotal;

  let finalTotal = cartTotal;
  if (isCouponApplied && coupon?.discountPercentage) {
    finalTotal = finalTotal - (finalTotal * coupon.discountPercentage) / 100;
  }

  const formattedSubtotal = cartSubtotal.toFixed(2);
  // eslint-disable-next-line no-unused-vars
  const formattedTotal = finalTotal.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const FREE_SHIPPING_THRESHOLD = 5000;
  const SHIPPING_COST = 300;

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const amountForFreeShipping =
    cartTotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FREE_SHIPPING_THRESHOLD - cartTotal;

  const finalTotalWithShipping = finalTotal + shippingCost;

  const goToBilling = () => {
    if (!cart.length) return;
    navigate("/place-your-order");
  };

  return (
    <div className="py-10 px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center lg:text-left">
        Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="lg:flex gap-10">
          {/* Cart Items */}
          <motion.div
            className="flex-1 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {cart.map((item) => {
              const id = item.cartItemId || item._id;
              const price = item.price || 0;
              const discountRate = item.discountRate || 0;

              const discountedPrice = item.hasDiscount
                ? (price * (100 - discountRate)) / 100
                : price;

              const imageUrl = item.mainImage?.startsWith("http")
                ? item.mainImage
                : `${import.meta.env.VITE_API_BASE_URL}${item.mainImage}`;

              return (
                <div
                  key={id}
                  className="relative rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-row items-center justify-between gap-5 sm:gap-6">

                    {/* Product Image with Quantity Badge */}
                    <div className="shrink-0 relative w-fit">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="h-20 w-20 sm:h-32 sm:w-32 rounded-lg object-fill"
                      />
                      {/* Quantity Badge */}
                      <div className="absolute -top-2 -right-2 sm:-top-2 sm:-right-2 rounded-full bg-white text-black text-sm sm:text-base font-semibold w-6 h-6 sm:w-6 sm:h-6 flex items-center justify-center shadow-md">
                        {item.quantity}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-2 sm:ml-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                      <button
                        onClick={() => removeFromCart(id)}
                        className="flex items-center gap-1 text-xs sm:text-sm font-medium text-red-500 hover:text-red-600 transition"
                      >
                        <Trash size={16} /> Remove
                      </button>
                    </div>

                    {/* Price + Quantity Controls */}
                    <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
                      {/* Price */}
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        {item.hasDiscount ? (
                          <>
                            <span className="text-sm sm:text-base text-red-600 line-through">
                              Rs. {price}
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-emerald-600">
                              Rs. {discountedPrice.toFixed(0)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg sm:text-xl font-bold text-emerald-600">
                            Rs. {price}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(id, item.quantity - 1)}
                          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white transition"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="min-w-[24px] text-center text-gray-800 font-medium text-sm sm:text-base">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(id, item.quantity + 1)}
                          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:w-96 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white border border-gray-200 p-6 mb-4 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-5">
                Order Summary
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span>Rs. {formattedSubtotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>- Rs. {formattedSavings}</span>
                  </div>
                )}
                {isCouponApplied && coupon?.code && (
                  <div className="flex justify-between text-blue-600">
                    <span>Coupon ({coupon.code})</span>
                    <span>-{coupon.discountPercentage}%</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-gray-800">
                  <span>Shipping</span>
                  <span>Rs. {shippingCost}</span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {finalTotalWithShipping.toFixed(2)}</span>
                </div>

                {/* Free shipping nudge / celebration */}
                {amountForFreeShipping > 0 ? (
                  <p className="text-sm text-orange-600 mt-2">
                    Add Rs. {amountForFreeShipping.toFixed(0)} more to get FREE
                    shipping!
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-2 font-semibold">
                    🎉 You have qualified for FREE shipping!
                  </p>
                )}
              </div>

              <button
                onClick={goToBilling}
                disabled={!cart.length}
                className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition ${
                  !cart.length ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                Place Order
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm text-gray-500">or</span>
                <Link
                  to="/"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            <GiftCouponCard />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
