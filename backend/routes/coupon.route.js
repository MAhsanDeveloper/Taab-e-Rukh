import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { 
  getCoupon, 
  validateCoupon, 
  getAllCoupons, 
  createCoupon, 
  deleteCoupon 
} from "../controllers/coupon.controller.js";


const router = express.Router();

router.get("/", getCoupon);
router.post("/validate", validateCoupon);

router.get("/all", protectRoute, adminRoute, getAllCoupons);
router.post("/", protectRoute, adminRoute, createCoupon);
router.delete("/:id", protectRoute, adminRoute, deleteCoupon);

export default router;
