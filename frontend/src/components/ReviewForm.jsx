import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate, useLocation } from "react-router-dom";

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const { user } = useUserStore();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [pendingReview, setPendingReview] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 If user logs in while we had a pending review → auto submit
  useEffect(() => {
    if (user && pendingReview) {
      submitReview(pendingReview.rating, pendingReview.comment);
      setPendingReview(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submitReview = async (ratingValue, commentValue) => {
    try {
      const res = await axios.post(
        `/products/${productId}/reviews`,
        { rating: Number(ratingValue), comment: commentValue },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      onReviewSubmit(res.data);

      // Reset form
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.message || "Error submitting review. Try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select a rating ⭐");
      return;
    }

    if (!user) {
      // save review data temporarily
      setPendingReview({ rating, comment });
      setShowLoginModal(true);
      return;
    }

    submitReview(rating, comment);
  };

  return (
    <>
      {/* Review Form */}
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

      {/* Blocking Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-3">Login Required</h2>
            <p className="text-sm text-gray-600 mb-5">
              You need to login before submitting your review.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate("/login", { state: { from: location } }); 
                  // redirect to login page
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewForm;
