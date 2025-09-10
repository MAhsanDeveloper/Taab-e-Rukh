import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
  updateProduct,
  getProductById,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { uploadProductImages } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);

router.post("/", protectRoute, adminRoute, uploadProductImages, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.put(
  "/:id",
  protectRoute,
  adminRoute,
  uploadProductImages,
  updateProduct
);

export default router;
