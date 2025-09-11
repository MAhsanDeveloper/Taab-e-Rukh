import express from "express";
import { adminLogin, login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/admin-login", adminLogin);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

router.get("/check-admin", protectRoute, adminRoute, (req, res) => {
  res.json({ isAdmin: true });
});


export default router;
