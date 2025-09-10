import express from "express";
import { getSpotlight, updateSpotlight } from "../controllers/spotlight.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getSpotlight);

router.put("/", protectRoute, adminRoute, updateSpotlight);

export default router;
