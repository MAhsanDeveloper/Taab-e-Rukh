import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },

    mainImage: { type: String, required: true }, // one main image
    previewImages: [{ type: String }], // multiple preview images

    category: { type: String, required: true },

    hasDiscount: { type: Boolean, default: false },
    discountRate: { type: Number, default: 0 }, // %

    available: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
