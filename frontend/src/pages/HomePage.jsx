import { useEffect, useState } from "react";
import axios from "../lib/axios";
import Hero from "../components/Hero";
import FeaturedProduct from "./FeaturedProduct";
import USPSTRIP from "../components/USPSTRIP";
import SpotlightCategory from "../components/SpotlightCategories";
import CategoryCarousel from "../components/CategoryCarousel";

const HomePage = () => {
  const [spotlight, setSpotlight] = useState([]);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const res = await axios.get("/spotlight");
        setSpotlight(res.data.categories || []);
      } catch (err) {
        console.error("Failed to load spotlight", err);
      }
    };
    fetchSpotlight();
  }, []);

  return (
    <>
      <Hero />

      <CategoryCarousel />

      {spotlight.map((cat) => (
        <SpotlightCategory key={cat} categorySlug={cat} />
      ))}

      <div className="pt-[0px]">
        <FeaturedProduct />
      </div>

      <USPSTRIP />
    </>
  );
};

export default HomePage;
