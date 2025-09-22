import { Star } from "lucide-react";

const ProductReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500 text-sm">No reviews yet</p>;
  }

  return (
    <div className="space-y-3 mt-3">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border rounded-lg p-3 bg-gray-50 shadow-sm"
        >
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`${
                  review.rating >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
          )}

          {/* User + Date */}
          <p className="text-xs text-gray-500 mt-1">
            by {review.user?.name || "Anonymous"} on{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
