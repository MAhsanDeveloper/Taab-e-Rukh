import { useEffect, useState, useRef } from "react";
import axios from "../lib/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "./CategoryCard";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const hardcodedCategories = [
  { name: "All Products", slug: "all-products" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Skin Care", slug: "skin-care" },
  { name: "Body Care", slug: "body-care" },
];

const CategoryCarousel = ({ className = "" }) => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/category-images`);
        const imageMap = res.data.images.reduce((acc, img) => {
          acc[img.slug] = img.image;
          return acc;
        }, {});

        setCategories(
          hardcodedCategories.map((cat) => ({
            ...cat,
            image: imageMap[cat.slug] || "/images/placeholder.jpg",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch category images", err);
      }
    };
    fetchImages();
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    // dynamically calculate scroll amount
    const card = scrollRef.current.querySelector(".group");
    const cardWidth = card ? card.offsetWidth + 16 : 300;

    scrollRef.current.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;
    carousel.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => carousel.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className={`relative container overflow-hidden ${className}`}>
      {/* Left Chevron */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 mr-2 sm:gap-8 lg:gap-10 overflow-x-auto scroll-smooth px-2 sm:px-4 py-3 hide-scrollbar max-w-full"
      >
        {categories.map((cat) => (
          <div key={cat.slug} className="flex-shrink-0 w-[70vw] sm:w-64 md:w-72 lg:w-80">
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>

      {/* Right Chevron */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
};

export default CategoryCarousel;
