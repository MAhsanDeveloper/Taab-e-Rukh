import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh] overflow-hidden md:px-8 lg:px-12 mt-2 sm:m-0">
      <div className="relative w-full h-full flex sm:block overflow-x-auto sm:overflow-hidden snap-x sm:snap-none">
      <div className="relative w-full h-full">
  {images.map((img, index) => (
    <div
      key={img._id}
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        index === currentIndex ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={`${img.url.replace("/upload/", "/upload/f_auto,q_auto:best/")}`}
        alt="Hero"
        className="w-full h-full object-fill rounded-xl"
        fetchPriority={index === currentIndex ? "high" : "low"}
        loading={index === currentIndex ? "eager" : "lazy"}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent rounded-xl"></div>
    </div>
  ))}
</div>


        {/* Arrows (hidden on mobile) */}
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
