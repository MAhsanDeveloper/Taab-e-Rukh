// FeaturedProducts.jsx
import ProductCard from "./ProductCard";

const FeaturedProducts = ({ featuredProducts = [], category }) => {
  if (!Array.isArray(featuredProducts) || featuredProducts.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <h2 className="text-2xl font-semibold">
            No Featured Products Available
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-left text-5xl sm:text-6xl font-bold text-gray-500 mb-8">
  Featured in {category?.replace(/-/g, " ")}
</h2>

        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
