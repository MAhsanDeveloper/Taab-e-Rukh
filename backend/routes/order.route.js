import express from "express";
import Order from "../models/order.model.js";

import { createOrder, getAllOrders, deleteOrder} from "../controllers/order.controller.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { generatePackagingSlip } from "../utils/generatePackageSlip.js";

const router = express.Router();

router.post("/orders/create", createOrder);
router.get("/orders", getAllOrders);
router.delete("/:id", deleteOrder);

// Generate Invoice PDF
// Generate Invoice PDF
router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product", "name price") // always populate name & price
      .lean(); // convert Mongoose doc to plain object

    if (!order) return res.status(404).json({ message: "Order not found" });

    // DEBUG: Always log product info
    console.log("🧾 [DEBUG] Order products for invoice:");
    order.products.forEach((p, i) => {
      console.log(
        `Product #${i + 1}:`,
        p.product ? p.product.name : "No product object",
        "| Quantity:", p.quantity,
        "| Price:", p.price ?? p.product?.price
      );
    });

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
    const order = await Order.findById(req.params.id)
      .populate("products.product", "name price")
      .lean();

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
