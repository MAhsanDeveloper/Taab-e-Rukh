import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";
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
    for (let key of ["fullName", "phone", "address", "city"]) {
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
        products: cart.map((p) => ({
          _id: p._id,
          quantity: p.quantity,
          price: p.price,
        })),
        couponCode: coupon?.code || null,
        paymentMethod,
        shippingDetails: { ...form },
        totalAmount: finalTotalWithShipping,
      };

      const res = await axios.post("/payments/orders/create", orderData);
      if (res.status === 201) {
        toast.success("Order placed successfully!");
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
    <div className="py-10 px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center lg:text-left">
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
        <div className="lg:flex gap-8">
          {/* Billing Form */}
          <motion.div
            className="lg:flex-[1.3] order-2 lg:order-1 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Your Details
            </h2>

            <div className="space-y-5">
              {[
                { label: "Full Name", name: "fullName", type: "text", required: true },
                { label: "Phone", name: "phone", type: "tel", required: true },
                { label: "Email (optional)", name: "email", type: "email", required: false },
                { label: "Address", name: "address", type: "text", required: true },
                { label: "City", name: "city", type: "text", required: true },
                { label: "Order Notes (optional)", name: "note", type: "text", required: false },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-gray-600 mb-1 font-medium">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              ))}

              {/* Payment Method */}
              <div className="flex flex-col mt-6">
                <label className="text-gray-600 mb-2 font-medium">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.name}
                      className={`flex items-center justify-between border rounded-lg w-fit px-4 py-3 cursor-pointer transition ${
                        method.disabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "hover:border-blue-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value={method.name}
                          checked={paymentMethod === method.name}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="accent-blue-600"
                          disabled={method.disabled}
                        />
                        <span>{method.name}</span>
                      </div>
                      {method.disabled && (
                        <span className="text-sm text-blue-500 italic px-2">
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
                className={`mt-8 px-20 py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:flex-[0.7] order-1 lg:order-2 mt-8 lg:mt-0 lg:sticky lg:top-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Mobile toggle */}
            <div className="lg:hidden mb-3">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="flex items-center justify-between w-full bg-[#FFF8F0] px-4 py-3 rounded-lg border border-gray-200 font-medium text-gray-800 shadow-md"
              >
                <span>Order Summary</span>
                {showSummary ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>

            {/* Summary Content */}
            <AnimatePresence>
              {(showSummary || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
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
          </motion.div>
        </div>
      )}
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
    <div className="bg-[#FFF8F0] p-6 rounded-2xl shadow-md border border-gray-200 max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-5">Order Summary</h3>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {cart.map((item) => {
          const imageUrl = item.mainImage?.startsWith("http")
            ? item.mainImage
            : `${baseURL}${item.mainImage}`;
          return (
            <div
              key={item._id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0"
            >
              <img
                src={imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />
              <div className="flex-1 px-3">
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-semibold text-gray-800">
                PKR {item.price * item.quantity}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t pt-4 text-gray-700 space-y-2">
        <p className="flex justify-between text-sm">
          <span>Original Price</span>
          <span>PKR {formattedSubtotal}</span>
        </p>
        {savings > 0 && (
          <p className="flex justify-between text-sm text-green-600">
            <span>Savings</span>
            <span>-PKR {formattedSavings}</span>
          </p>
        )}
        {isCouponApplied && coupon?.code && (
          <p className="flex justify-between text-sm text-blue-600">
            <span>Coupon ({coupon.code})</span>
            <span>-{coupon.discountPercentage}%</span>
          </p>
        )}
        <p className="flex justify-between text-sm text-gray-800">
          <span>Shipping</span>
          <span>PKR {shippingCost}</span>
        </p>
        <p className="flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>PKR {finalTotalWithShipping.toFixed(2)}</span>
        </p>
        {amountForFreeShipping > 0 ? (
          <p className="text-sm text-orange-600 mt-2">
            Add Rs. {amountForFreeShipping.toFixed(0)} more to get FREE shipping!
          </p>
        ) : (
          <p className="text-sm text-green-600 mt-2 font-semibold">
            🎉 You have qualified for FREE shipping!
          </p>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
