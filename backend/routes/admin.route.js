import express from "express";
import { createAdmin } from "../controllers/admin.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-admin", protectRoute, adminRoute, createAdmin);

export default router;