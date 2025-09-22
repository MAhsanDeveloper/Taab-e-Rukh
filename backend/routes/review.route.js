import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addOrUpdateReview, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/:productId/reviews", protectRoute, addOrUpdateReview);
router.put("/:productId/reviews", protectRoute, addOrUpdateReview); // same handler for update
router.delete("/:productId/reviews/:reviewId", protectRoute, deleteReview);

export default router;