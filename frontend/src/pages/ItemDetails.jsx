import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import AddToCartButton from "../components/AddToCartButton";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/shop/${id}`);
        const product = res.data;

        setItem(product);

        const mainImg = product.mainImage?.startsWith("http")
          ? product.mainImage
          : `${baseURL}${product.mainImage}`;

        setMainImage(mainImg);
      } catch (err) {
        console.error("Failed to fetch item", err);
        toast.error("Failed to load item details");
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <div className="text-white text-center mt-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 text-white px-4 sm:px-8 py-6">
      {/* Back Button */}
      <div className="mb-4 sm:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-black hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      <div className="max-w-6xl text-black mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div>
          <img
            src={mainImage}
            alt={item.name}
            className="w-full max-h-[400px] object-fill rounded-xl shadow-md border border-gray-700"
          />

          {/* Thumbnails */}
          {[item.mainImage, ...(item.previewImages || [])].slice(0, 3).map((img, index) => {
            const finalUrl = img?.startsWith("http") ? img : `${baseURL}${img}`;
            return (
              <img
                key={index}
                src={finalUrl}
                alt={`preview-${index}`}
                onClick={() => setMainImage(finalUrl)}
                className={`w-20 h-20 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                  mainImage === finalUrl
                    ? "border-primary ring-2 ring-primary"
                    : "border-gray-600"
                }`}
              />
            );
          })}
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

          {/* Buttons Section */}
          <div className="flex flex-col items-center gap-4">
            {item.inStock ? (
              <AddToCartButton
                product={item}
                className="bg-black hover:bg-white hover:text-black border border-black 
                           text-white font-bold rounded-full px-10 py-4 
                           transition-all duration-300 ease-in-out 
                           shadow-md hover:shadow-lg hover:scale-105"
              />
            ) : (
              <button
                disabled
                className="w-full bg-red-600 text-white font-semibold px-6 py-3 rounded-xl cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}

            {/* Go to Cart Shortcut */}
            <Link
              to="/cart"
              className="inline-block text-center bg-gradient-to-r from-blue-500 to-indigo-600 
                         hover:from-blue-600 hover:to-indigo-700 
                         text-white font-semibold px-10 py-3 rounded-full 
                         transition-all duration-300 ease-in-out 
                         shadow-md hover:shadow-lg hover:scale-105"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
