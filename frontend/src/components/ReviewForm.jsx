import { useState } from "react";
import { Star } from "lucide-react";
import axios from "../lib/axios";

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      const res = await axios.post(
        `/products/${productId}/reviews`,
        { rating: Number(rating), comment }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // res.data is already parsed JSON
      onReviewSubmit(res.data);

      // Reset form
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(
        err.response?.data?.message || "Error submitting review. Try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow-sm bg-white space-y-3"
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={22}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer ${
              (hover || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full border p-2 rounded-md text-sm"
      />

      <button
        type="submit"
        className="bg-emerald-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-emerald-700 transition"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
