import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useNavigate, Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const BillingPage = () => {
  const { cart, coupon, isCouponApplied } = useCartStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const summaryRef = useRef(null);
  const formRef = useRef(null);

  const FREE_SHIPPING_THRESHOLD = 5000;
  const SHIPPING_COST = 300;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.price || 0;
    return acc + price * item.quantity;
  }, 0);

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

  const shippingCost =
    finalTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const amountForFreeShipping =
    finalTotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FREE_SHIPPING_THRESHOLD - finalTotal;
  const finalTotalWithShipping = finalTotal + shippingCost;

  const formattedSubtotal = cartSubtotal.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  useEffect(() => {
    (async () => {
      try {
        await axios.get("/csrf-token");
      } catch (err) {
        console.error("Error fetching CSRF token", err);
      }
    })();
  }, []);

  const handlePlaceOrder = async () => {
    for (const key of ["fullName", "phone", "address", "city"]) {
      if (!form[key]) {
        toast.error(`Please enter your ${key}`);
        return;
      }
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        products: cart.map((p) => {
          if (!p._id && !p.productId) {
            throw new Error("Cart item missing product ID");
          }
          return {
            product: p.productId || p._id, // logged-in users: productId, guests: _id
            quantity: p.quantity,
            price: p.price,
          };
        }),

        couponCode: coupon?.code || null,
        paymentMethod,
        shippingDetails: { ...form },
        totalAmount: finalTotalWithShipping,
      };
      const res = await axios.post("/payments/orders/create", orderData);
      if (res.status === 201) {
        toast.success("Order placed successfully!");
        // Clear cart for logged-in users
        useCartStore.getState().clearCart();
        navigate("/order-success");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { name: "Cash on Delivery", disabled: false },
    { name: "JazzCash", disabled: true },
    { name: "Easypaisa", disabled: true },
    { name: "Bank Transfer (Through FastPay)", disabled: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="py-6 mt-10 sm:py-10 px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center lg:text-left">
          Billing & Shipping
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:flex lg:items-start gap-6 xl:gap-8 relative">
            {/* Mobile Order Summary (fixed on top) */}
            <div className="lg:hidden fixed top-20 left-0 right-0 z-50 px-4 py-2 bg-white border-b border-gray-200 shadow-md">
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-800">
                  view full order summary
                </div>
                <span className="font-bold text-gray-800">
                  Total: PKR {finalTotalWithShipping.toFixed(2)}
                </span>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="flex items-center justify-center text-gray-800"
                >
                  {showSummary ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {showSummary && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2"
                  >
                    <SummaryContent
                      cart={cart}
                      formattedSubtotal={formattedSubtotal}
                      formattedSavings={formattedSavings}
                      finalTotalWithShipping={finalTotalWithShipping}
                      savings={savings}
                      isCouponApplied={isCouponApplied}
                      coupon={coupon}
                      shippingCost={shippingCost}
                      amountForFreeShipping={amountForFreeShipping}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Billing Form */}
            <motion.div
              ref={formRef}
                className="lg:flex-[1.3] order-2 lg:order-1 bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 mt-[220px] sm:mt-[240px] lg:mt-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                Your Details
              </h2>

              <div className="space-y-4 sm:space-y-5">
                {[
                  {
                    label: "Full Name",
                    name: "fullName",
                    type: "text",
                    required: true,
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "tel",
                    required: true,
                  },
                  {
                    label: "Email (to receive order confirmation email)",
                    name: "email",
                    type: "email",
                    required: false,
                  },
                  {
                    label: "Address",
                    name: "address",
                    type: "text",
                    required: true,
                  },
                  { label: "City", name: "city", type: "text", required: true },
                  {
                    label: "Order Notes (optional)",
                    name: "note",
                    type: "text",
                    required: false,
                  },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-gray-600 mb-1 font-medium text-sm sm:text-base">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="rounded-lg border border-gray-300 p-2.5 sm:p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                    />
                  </div>
                ))}

                {/* Payment Method */}
                <div className="flex flex-col mt-4 sm:mt-6">
                  <label className="text-gray-600 mb-2 font-medium text-sm sm:text-base">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.name}
                        className={`flex items-center justify-between border rounded-lg w-full sm:w-fit px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition text-sm sm:text-base ${
                          method.disabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "hover:border-blue-400"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <input
                            type="radio"
                            value={method.name}
                            checked={paymentMethod === method.name}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-blue-600"
                            disabled={method.disabled}
                          />
                          <span className="flex-1">{method.name}</span>
                        </div>
                        {method.disabled && (
                          <span className="text-xs sm:text-sm text-blue-500 italic px-1 sm:px-2">
                            (Will be added soon)
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Place Order button */}
              <div className="flex justify-center">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`mt-6 sm:mt-8 px-8 sm:px-20 py-2.5 sm:py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </motion.div>

            {/* Desktop Summary */}
            <motion.div
              ref={summaryRef}
              className="hidden lg:block lg:flex-[0.7] order-1 lg:order-2 mt-0 lg:sticky lg:top-4 lg:self-start"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SummaryContent
                cart={cart}
                formattedSubtotal={formattedSubtotal}
                formattedSavings={formattedSavings}
                finalTotalWithShipping={finalTotalWithShipping}
                savings={savings}
                isCouponApplied={isCouponApplied}
                coupon={coupon}
                shippingCost={shippingCost}
                amountForFreeShipping={amountForFreeShipping}
              />
            </motion.div>
          </div>
        )}
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-16 mt-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center text-xs sm:text-sm text-gray-700">
            <Link
              to="/privacy-policy"
              className="text-blue-600 hover:underline text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/return-refund-policy"
              className="text-blue-600 hover:underline text-sm transition-colors"
            >
              Return & Refund Policy
            </Link>
            <Link
              to="/shipping-policy"
              className="text-blue-600 hover:underline text-sm transition-colors"
            >
              Shipping Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-blue-600 hover:underline text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SummaryContent = ({
  cart,
  formattedSubtotal,
  formattedSavings,
  finalTotalWithShipping,
  savings,
  isCouponApplied,
  coupon,
  shippingCost,
  amountForFreeShipping,
}) => {
  return (
    <div className="bg-[#FFF8F0] p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5">
        Order Summary
      </h3>

      <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-72 overflow-y-auto pr-1 sm:pr-2">
        {cart.map((item) => {
          const imageUrl = item.mainImage?.startsWith("http")
            ? item.mainImage
            : `${baseURL}${item.mainImage}`;
          return (
            <div
              key={item._id}
              className="flex items-center justify-between border-b pb-2 sm:pb-3 last:border-b-0"
            >
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={item.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border flex-shrink-0"
              />
              <div className="flex-1 px-2 sm:px-3 min-w-0">
                <h4 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-800 flex-shrink-0">
                PKR {item.price * item.quantity}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-5 border-t pt-3 sm:pt-4 text-gray-700 space-y-1.5 sm:space-y-2">
        <p className="flex justify-between text-xs sm:text-sm">
          <span>Original Price</span>
          <span>PKR {formattedSubtotal}</span>
        </p>
        {savings > 0 && (
          <p className="flex justify-between text-xs sm:text-sm text-green-600">
            <span>Savings</span>
            <span>-PKR {formattedSavings}</span>
          </p>
        )}
        {isCouponApplied && coupon?.code && (
          <p className="flex justify-between text-xs sm:text-sm text-blue-600">
            <span>Coupon ({coupon.code})</span>
            <span>-{coupon.discountPercentage}%</span>
          </p>
        )}
        <p className="flex justify-between text-xs sm:text-sm text-gray-800">
          <span>Shipping</span>
          <span>PKR {shippingCost}</span>
        </p>
        <p className="flex justify-between font-semibold text-gray-900 text-sm sm:text-base">
          <span>Total</span>
          <span>PKR {finalTotalWithShipping.toFixed(2)}</span>
        </p>
        {amountForFreeShipping > 0 ? (
          <p className="text-xs sm:text-sm text-orange-600 mt-2">
            Add Rs. {amountForFreeShipping.toFixed(0)} more to get FREE
            shipping!
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-green-600 mt-2 font-semibold">
            🎉 You have qualified for FREE shipping!
          </p>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
