import { useEffect, useState } from "react";
import { useParams, useNavigate, } from "react-router-dom";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";
import { ArrowLeft, Truck, BadgeCheck, Wallet } from "lucide-react";
import AddToCartButton from "../components/AddToCartButton";
import USPSTRIP from "../components/USPSTRIP";
import ReviewForm from "../components/ReviewForm";
import ProductReviews from "../components/ProductReviews";
import ItemDetailsSkeleton from "../skeletons/ItemDetailsSkeleton";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleReviewSubmit = (data) => {
    setReviews(data.reviews);
    toast.success(data.message);
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/shop/${id}`);
        const product = res.data;
        setItem(product);
        setReviews(product.reviews || []);
        const mainImg = product.mainImage?.startsWith("http")
          ? product.mainImage
          : `${baseURL}${product.mainImage}`;
        setMainImage(mainImg);
      } catch (err) {
        console.error("Failed to fetch item", err);
        toast.error("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleBuyNow = async () => {
    await addToCart(item); // Add product to cart first
    navigate("/place-your-order");
  };

  // Fetch the product details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <ItemDetailsSkeleton />;
  }

  if (!item) {
    return (
      <div className="text-gray-600 text-center mt-16">Item not found.</div>
    );
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

      <div className="max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
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
                ? ` ${item.available} item(s) available, Ready To Ship`
                : "Out of Stock"}
            </p>

            {/* Price section on single line */}
            <div className="mt-3 flex items-baseline gap-3">
              {item.hasDiscount ? (
                <>
                  <span className="text-lg text-gray-400 line-through decoration-2 decoration-red-500">
                    Rs {item.price.toLocaleString()}
                  </span>
                  <span className="text-3xl text-emerald-600 font-extrabold">
                    Rs{" "}
                    {Math.round(
                      item.price - (item.price * item.discountRate) / 100
                    ).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl text-yellow-600 font-bold">
                  Rs {item.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Discount message */}
            {item.hasDiscount && (
              <p className="text-sm text-green-500 font-medium">
                Save {item.discountRate}% instantly!
              </p>
            )}
          </div>

          {/* Buttons in single line */}
          <div className="flex items-center gap-4 pt-2">
            {item.inStock ? (
              <AddToCartButton
                product={item}
                className="flex-1 bg-black hover:bg-white hover:text-black border border-black 
                   text-white font-bold rounded-full px-10 py-4 
                   transition-all duration-300 ease-in-out 
                   shadow-md hover:shadow-lg"
              />
            ) : (
              <button
                disabled
                className="flex-1 bg-red-600 text-white font-semibold px-6 py-3 rounded-full cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}

            <button
              onClick={handleBuyNow}
              className="flex-1 text-center cursor-pointer bg-black text-white hover:bg-white hover:text-black border-black font-bold px-10 py-4 rounded-full transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:scale-105"
            >
              Buy Now
            </button>
          </div>

        {/* Trust / Benefit messages */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
  <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl shadow-sm">
    <Truck className="w-5 h-5 text-emerald-600" />
    <span className="text-sm font-medium text-gray-700">Fast Shipping</span>
  </div>
  <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl shadow-sm">
    <BadgeCheck className="w-5 h-5 text-emerald-600" />
    <span className="text-sm font-medium text-gray-700">Quality Guaranteed</span>
  </div>
  <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl shadow-sm">
    <Wallet className="w-5 h-5 text-emerald-600" />
    <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
  </div>
</div>
        </div>
      </div>

      <div className="mt-20">
        <USPSTRIP />
      </div>
      {/* Reviews */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h3>
        <ReviewForm productId={item._id} onReviewSubmit={handleReviewSubmit} />
        <div className="mt-8">
          <ProductReviews reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
