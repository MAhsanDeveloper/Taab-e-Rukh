import Product from "../models/product.model.js";

export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user has already reviewed
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingReview) {
      // optional: update review
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      // add new review
      product.reviews.push({
        user: userId,
        name: req.user.name, // <-- attach actual user name
        rating,
        comment,
      });
    }

    await product.save();

    res.status(201).json({ message: "Review added successfully", review: { user: req.user.name, rating, comment } });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const addOrUpdateReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingReview = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString(),
      console.log("User submitting review:", req.user._id)
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      product.reviews.push({
        user: req.user._id,
        rating,
        comment,
      });
    }

    // Update stats
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
      product.numReviews;

    await product.save();

    res.json({
      message: existingReview ? "Review updated" : "Review added",
      reviews: product.reviews,
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error("Error in addOrUpdateReview:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.find(
      (rev) => rev._id.toString() === reviewId
    );
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    product.reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId
    );

    product.numReviews = product.reviews.length;
    product.averageRating =
      product.numReviews > 0
        ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          product.numReviews
        : 0;

    await product.save();

    res.json({
      message: "Review deleted",
      reviews: product.reviews,
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error("Error in deleteReview:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
