import { useEffect, useState, lazy, Suspense } from "react";
import axios from "../lib/axios";
import Hero from "../components/Hero";

//  Define helper BEFORE usage
// eslint-disable-next-line no-unused-vars
const withSuspense = (Component) => {
  return (props) => (
    <Suspense fallback={<div className="text-center py-10"></div>}>
      <Component {...props} />
    </Suspense>
  );
};

//  Lazy imports wrapped with Suspense
const FeaturedProduct = withSuspense(lazy(() => import("./FeaturedProduct")));
const USPSTRIP = withSuspense(lazy(() => import("../components/USPSTRIP")));
const SpotlightCategory = withSuspense(lazy(() => import("../components/SpotlightCategories")));
const CategoryCarousel = withSuspense(lazy(() => import("../components/CategoryCarousel")));

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
