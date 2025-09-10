import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const BillingPage = () => {
  const { cart, coupon, total } = useCartStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    for (let key of ["fullName", "email", "phone", "address", "city"]) {
      if (!form[key]) {
        toast.error(`Please enter your ${key}`);
        return;
      }
    }

    if (!cart.length) {
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
        totalAmount: total,
      };

      const res = await axios.post(`${baseURL}/api/payments/orders/create`, orderData);

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
    { name: "Bank Transfer", disabled: true },
  ];

  return (
    <div className="py-6 px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6 text-center lg:text-left">
        Billing & Shipping
      </h1>

      <div className="lg:flex gap-8">
        {/* Billing Form */}
        <motion.div
          className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-5">Your Details</h2>

          <div className="space-y-4">
            {[
              { label: "Full Name", name: "fullName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "tel" },
              { label: "Address", name: "address", type: "text" },
              { label: "City", name: "city", type: "text" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-gray-300 mb-1">
                  {field.label} <span className="text-rose-500">*</span>
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-600 bg-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
              </div>
            ))}

            {/* Payment Method */}
            <div className="flex flex-col mt-4">
              <label className="text-gray-300 mb-2">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.name}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition ${
                      method.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-white hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.name}
                      checked={paymentMethod === method.name}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-emerald-500"
                      disabled={method.disabled}
                    />
                    {method.name}
                    {method.disabled && (
                      <span className="ml-1 text-sm text-yellow-400 italic">
                        (Will be added soon)
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`mt-6 w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          className="lg:w-96 mt-6 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Replace this with your OrderSummary component */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <p>Total Items: {cart.length}</p>
            <p>Total Amount: PKR {total}</p>
            {coupon && <p>Coupon Applied: {coupon.code}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingPage;
