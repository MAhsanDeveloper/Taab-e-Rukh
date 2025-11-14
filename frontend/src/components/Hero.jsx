import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({}); // track which images are loaded

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/api/hero-images`);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch hero images", err);
    }
  };

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="relative px-4 h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] overflow-hidden md:px-8 lg:px-12 lg:py-2 mt-2 sm:m-0">
      <div className="relative w-full h-full flex sm:block overflow-x-auto sm:overflow-hidden snap-x sm:snap-none">
        <div className="relative w-[95%] lg:w-[80%] h-full mx-auto">
          {images.length === 0 ? (
            // ✅ FCP placeholder
            <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
          ) : (
            images.map((img, index) => {
              const isCurrent = index === currentIndex;
              const hasLoaded = loadedImages[index];

              return (
                <div
                  key={img._id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isCurrent && hasLoaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* ✅ Image loading placeholder */}
                  {!hasLoaded && (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse rounded" />
                  )}

                  <img
                    src={`${img.url.replace(
                      "/upload/",
                      "/upload/f_auto,q_auto:best/"
                    )}`}
                    alt="Hero"
                    className="w-full h-full object-fill rounded"
                    onLoad={() => handleImageLoad(index)}
                    fetchPriority={isCurrent ? "high" : "low"}
                    loading={isCurrent ? "eager" : "lazy"}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Arrows */}
        <div className="absolute bottom-12 left-0 right-0 justify-between px-4 md:px-8 lg:px-12 z-20 hidden sm:flex">
          <button
            onClick={prevSlide}
            className="text-white hover:text-gray-200 transition transform hover:scale-110 bg-black/30 backdrop-blur-sm p-2 rounded-full"
          >
            <ChevronLeft size={34} strokeWidth={2.5} />
          </button>
          <button
            onClick={nextSlide}
            className="text-white hover:text-gray-200 transition transform hover:scale-110 bg-black/30 backdrop-blur-sm p-2 rounded-full"
          >
            <ChevronRight size={34} strokeWidth={2.5} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3.5 h-3.5 rounded-full transition ${
                i === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
