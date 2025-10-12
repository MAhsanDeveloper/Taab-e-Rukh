import express from "express";
import Order from "../models/order.model.js";

import { createOrder, getAllOrders } from "../controllers/order.controller.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { generatePackagingSlip } from "../utils/generatePackageSlip.js";

const router = express.Router();

router.post("/orders/create", createOrder);
router.get("/orders", getAllOrders);

// Generate Invoice PDF
router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    generateInvoice(order, res);
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    res.status(500).json({ message: "Error generating invoice" });
  }
});

// Generate Packaging Slip PDF
router.get("/:id/pack-slip", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=packaging-slip-${order._id}.pdf`
    );

    generatePackagingSlip(order, res);
  } catch (error) {
    console.error("Failed to generate packaging slip:", error);
    res.status(500).json({ message: "Error generating packaging slip" });
  }
});

export default router;
