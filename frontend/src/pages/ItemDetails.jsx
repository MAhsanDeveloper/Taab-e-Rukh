/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [existingQuantity, setExistingQuantity] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/shop/${id}`);
        setItem(res.data);
        setMainImage(`${baseURL}${res.data.mainImage}`);
      } catch (err) {
        console.error("Failed to fetch item", err);
        toast.error("Failed to load item details");
      }
    };

    fetchItem();
    checkCartQuantity();
  }, [id]);

  const checkCartQuantity = () => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = cart.find((c) => c._id === id);
    setExistingQuantity(existingItem ? existingItem.quantity : 0);
  };

  const updateCartQuantity = (change) => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = cart.findIndex((item) => item._id === id);

    const finalPrice = item.hasDiscount
      ? Math.round(item.price - (item.price * item.discountRate) / 100)
      : item.price;

    if (index !== -1) {
      cart[index].quantity += change;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // remove from cart
      }
    } else if (change > 0) {
      cart.push({
        ...item,
        quantity: 1,
        price: finalPrice,
        image: `${baseURL}${item.mainImage}`,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));
    setExistingQuantity((prev) => Math.max(prev + change, 0));

    toast.success(change > 0 ? "Item added to cart" : "Item removed from cart");
  };

  if (!item) {
    return <div className="text-white text-center mt-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 text-white px-4 sm:px-8 py-6">
      {/* Back Button */}
      <div className="mb-4 sm:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-white hover:text-primary transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div>
          <img
            src={mainImage}
            alt={item.name}
            className="w-full max-h-[400px] object-contain rounded-xl shadow-md border border-gray-700"
          />

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-3 mt-4">
            {[item.mainImage, ...(item.previewImages || [])]
              .slice(0, 3)
              .map((img, index) => (
                <img
                  key={index}
                  src={`${baseURL}${img}`}
                  alt={`preview-${index}`}
                  onClick={() => setMainImage(`${baseURL}${img}`)}
                  className={`w-20 h-20 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                    mainImage === `${baseURL}${img}`
                      ? "border-primary ring-2 ring-primary"
                      : "border-gray-600"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {item.name}
            </h2>
           
            <p className="text-base text-black leading-relaxed">
              {item.description}
            </p>

            {/* Stock Status */}
            <p
              className={`text-sm font-semibold ${
                item.inStock ? "text-green-400" : "text-red-500"
              }`}
            >
              {item.inStock
                ? `${item.available} item(s) available`
                : "Out of Stock"}
            </p>

            {/* Price */}
            <div className="mt-2 space-y-1">
              {item.hasDiscount ? (
                <>
                  <p className="text-xl text-red-500 line-through">
                    Rs {item.price.toLocaleString()}
                  </p>
                  <p className="text-3xl text-green-400 font-extrabold">
                    Rs{" "}
                    {Math.round(
                      item.price - (item.price * item.discountRate) / 100
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-300">
                    Save {item.discountRate}% instantly!
                  </p>
                </>
              ) : (
                <p className="text-3xl text-yellow-400 font-bold">
                  Rs {item.price.toLocaleString()}
                  <div className="text-sm w-fit rounded text-green-500 text-left font-semibold z-10">
                    Free Delivery 
                  </div>
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          {item.inStock ? (
            <div className="flex flex-col gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => updateCartQuantity(-1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  disabled={existingQuantity <= 0}
                >
                  <FaMinus />
                </button>

                <button
                  onClick={() => updateCartQuantity(1)}
                  className="bg-green-600 hover:bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg"
                  disabled={existingQuantity >= item.available}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => updateCartQuantity(1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  disabled={existingQuantity >= item.available}
                >
                  <FaPlus />
                </button>

                <span className="text-xl font-bold text-white w-12 text-center">
                  {existingQuantity}
                </span>
              </div>

              {/* Cart Status */}
              {existingQuantity > 0 && (
                <div className="text-sm text-green-300 text-center space-y-1">
                  <p>
                    <span className="font-bold text-green-600">
                      {existingQuantity}
                    </span>{" "}
                    item(s) added to cart
                  </p>
                  <Link
                    to="/cart"
                    className="inline-block text-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-1 text-sm font-semibold"
                  >
                    Go to Cart
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-red-600 text-white font-semibold px-6 py-3 rounded-xl cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
