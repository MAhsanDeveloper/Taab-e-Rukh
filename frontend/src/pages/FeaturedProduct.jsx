import React, { useEffect, useState } from "react";
import axios from "axios";
import AddToCartButton from "../components/AddToCartButton";

const FeaturedProduct = () => {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/shop/featured`)
      .then((res) => {
        const featured = res.data || [];
        if (featured.length > 0) {
          const img = featured[0].mainImage.startsWith("http")
            ? featured[0].mainImage
            : `${import.meta.env.VITE_API_BASE_URL}${featured[0].mainImage}`;

          const fixedPreviews = featured[0].previewImages.map((img) =>
            img.startsWith("http")
              ? img
              : `${import.meta.env.VITE_API_BASE_URL}${img}`
          );

          setProduct({
            ...featured[0],
            mainImage: img,
            previewImages: fixedPreviews,
          });
          setMainImage(img);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        Loading...
      </div>
    );

  const MAIN_IMG_WIDTH = 450;
  const MAIN_IMG_HEIGHT = 450;

  const discountedPrice = product.hasDiscount
    ? (product.price * (100 - product.discountRate)) / 100
    : product.price;

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl max-w-6xl mx-auto my-5 p-2 md:p-6 gap-6 justify-between">
      {/* Left Side */}
      <div className="md:w-3/4 w-full flex flex-row items-center gap-4">
        {/* Previews */}
        <div className="flex flex-row md:flex-col gap-3 justify-center">
          {[product.mainImage, ...product.previewImages].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Preview ${i}`}
              className={`w-20 md:w-24 h-[100px] md:h-[120px] object-cover cursor-pointer border-2 rounded transition-transform duration-200 hover:scale-105 ${
                img === mainImage ? "border-yellow-500" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        {/* Main Image */}
        <div
          className="relative flex-1 flex items-center justify-center rounded-xl shadow bg-white"
          style={{ width: MAIN_IMG_WIDTH, height: MAIN_IMG_HEIGHT }}
        >
          <img
            src={mainImage}
            alt={product.name}
            className="object-fill w-full h-full rounded"
          />

          {/* Featured Badge */}
          <div className="absolute top-[-50px] right-[-50px] w-44 h-44 flex items-center justify-center">
            <div
              className="relative w-full h-full"
              style={{
                animation: "spinSlow 20s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              {"FEATURED•PRODUCT•".split("").map((letter, i, arr) => {
                const angle = (i / arr.length) * 360;
                return (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 text-black text-sm font-sans"
                    style={{
                      transform: `rotate(${angle}deg) translate(0, -80px) rotate(-${angle}deg)`,
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ✅ Add back animation keyframes */}
          <style>{`
            @keyframes spinSlow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start pl-10 space-y-4 md:space-y-6 text-left">
        <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

        {/* ✅ Keep admin formatting */}
        <p
          className="text-gray-700 text-sm md:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

  <div className="flex items-center gap-3 mt-2">
          {product.hasDiscount ? (
            <>
              <span className="text-xl text-black line-through">
                Rs. {product.price}
              </span>
              <span className="text-2xl font-bold text-red-500">
                Rs. {discountedPrice.toFixed(0)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-red-500">
              Rs. {product.price}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <AddToCartButton
          product={product}
          className="bg-black justify-center py-4 text-white border border-black rounded-3xl font-semibold w-80 
            hover:bg-white hover:text-black"
        />
      </div>
    </div>
  );
};

export default FeaturedProduct;
