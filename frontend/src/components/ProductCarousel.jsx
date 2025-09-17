import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductCarousel = ({ products }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector(".product-card");
    const cardWidth = card ? card.offsetWidth + 16 : 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;
    carousel.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => carousel.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left Button (hidden on mobile) */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition hidden sm:block"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth px-2 sm:px-4 py-4 hide-scrollbar max-w-full"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-[65vw] sm:w-64 md:w-72 lg:w-80"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Right Button (hidden on mobile) */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition hidden sm:block"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;
