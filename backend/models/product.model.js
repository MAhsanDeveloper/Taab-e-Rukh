import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    benefits: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    size: { type: Number, min: 0, required: true },
    sizeUnit: {
      type: String,
      default: "ml",
      enum: ["ml", "g", "mg", "l", "oz"],
    },

    mainImage: { type: String, required: true },
    previewImages: [{ type: String }],

    category: { type: String, required: true },

    hasDiscount: { type: Boolean, default: false },
    discountRate: { type: Number, default: 0 },

    available: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },

    isFeatured: { type: Boolean, default: false },

    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
