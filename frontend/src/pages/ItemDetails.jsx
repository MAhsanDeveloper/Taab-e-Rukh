import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import AddToCartButton from "../components/AddToCartButton";
import USPSTRIP from "../components/USPSTRIP";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
   const { addToCart } = useCartStore();
  const [mainImage, setMainImage] = useState("");

    const handleBuyNow = async () => {
    await addToCart(item); // Add product to cart first
    navigate("/place-your-order");
  };

  // Fetch the product details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/shop/${id}`);
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
    return <div className="text-gray-600 text-center mt-16"></div>;
  }

  return (
    <div className="min-h-screen bg-base-100 px-4 sm:px-8 py-6">
      {/* Back Button */}
      <div className="mb-4 sm:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-600 hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="flex flex-col items-center md:sticky md:top-24 self-start">
          <div className="w-full h-[390px] flex items-center justify-center border border-gray-200 rounded-xl shadow-md bg-white">
            <img
              src={mainImage}
              alt={item.name}
              className="w-full h-full object-fill rounded-xl"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {[item.mainImage, ...(item.previewImages || [])]
              .slice(0, 4)
              .map((img, index) => {
                const finalUrl = img?.startsWith("http")
                  ? img
                  : `${baseURL}${img}`;
                return (
                  <div
                    key={index}
                    onClick={() => setMainImage(finalUrl)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border cursor-pointer transition-all duration-200 flex items-center justify-center ${
                      mainImage === finalUrl
                        ? "ring-2 ring-primary border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={finalUrl}
                      alt={`preview-${index}`}
                      className="w-full h-full object-fill"
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {item.name}
            </h2>

            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>

            <p className="text-base text-emerald-700 font-medium">
              Size: {item.size} ml
            </p>

            <p
              className={`text-sm font-semibold ${
                item.inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {item.inStock
                ? `${item.available} item(s) available`
                : "Out of Stock"}
            </p>

            <div className="mt-3 space-y-2">
              {item.hasDiscount ? (
                <>
                  <p className="text-lg text-gray-500 relative inline-block">
                    <span
                      className="relative text-gray-400"
                      style={{
                        textDecoration: "line-through",
                        textDecorationColor: "red",
                        textDecorationThickness: "2px",
                        textDecorationStyle: "solid",
                        transform: "skewY(-5deg)",
                        display: "inline-block",
                      }}
                    >
                      Rs {item.price.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-3xl text-emerald-600 font-extrabold">
                    Rs{" "}
                    {Math.round(
                      item.price - (item.price * item.discountRate) / 100
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-500 font-medium">
                    Save {item.discountRate}% instantly!
                  </p>
                </>
              ) : (
                <div>
                  <p className="text-3xl text-yellow-600 font-bold">
                    Rs {item.price.toLocaleString()}
                  </p>
                  <span className="inline-block text-xs px-2 py-1 mt-1 rounded bg-green-100 text-green-700 font-medium">
                    Free Delivery
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {item.inStock ? (
              <AddToCartButton
                product={item}
                className="bg-black hover:bg-gray-800 border border-black 
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

         <button
      onClick={handleBuyNow}
      className="inline-block text-center cursor-pointer bg-black text-white hover:bg-white hover:text-black border-black font-semibold px-10 py-3 rounded-full transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:scale-105"
    >
      Buy Now
    </button>
          </div>
        </div>
      </div>

      {/* Featured Section
      {featured.length > 0 && (
        <Suspense fallback={<div className="py-12 text-center">Loading recommendations...</div>}>
          <div className="mt-10 mb-3">
            <h3 className="text-2xl font-bold mb-5">You may also like</h3>
            <FeaturedProducts featuredProducts={featured} category={item.category} />
          </div>
        </Suspense>
      )} */}

      <div  className="mt-20">
       <USPSTRIP />
      </div>

     
    </div>
  );
};

export default ItemDetails;
