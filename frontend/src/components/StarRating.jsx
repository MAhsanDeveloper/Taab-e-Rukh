// components/StarRating.jsx
import { Star } from "lucide-react";

const StarRating = ({ averageRating = 0, numReviews = 0, size = 16 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            averageRating >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-gray-600 ml-1">
        ({numReviews})
      </span>
    </div>
  );
};

export default StarRating;
