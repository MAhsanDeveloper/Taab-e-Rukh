import express from "express";
import { createOrder, getAllOrders } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/orders/create", createOrder);
router.get("/orders", getAllOrders);

export default router;
