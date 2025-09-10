import express from "express";
import CategoryImage from "../models/categoryImage.model.js";
import {
  uploadOptimizedBase64,
  deleteImageByUrl,
} from "../lib/cloudinaryUpload.js";

const router = express.Router();

// Get all category images
router.get("/", async (req, res) => {
  try {
    const images = await CategoryImage.find();
    res.json({ images });
  } catch (err) {
    console.error("Error fetching category images:", err.message);
    res.status(500).json({ message: "Error fetching category images" });
  }
});

// Upsert (add/update by slug)
router.post("/", async (req, res) => {
  try {
    const { slug, image } = req.body;
    if (!slug || !image) {
      return res.status(400).json({ message: "slug + image required" });
    }

    // 🔹 Upload optimized
    const upload = await uploadOptimizedBase64(image);

    // 🔹 If this slug already exists, delete the old image
    const existing = await CategoryImage.findOne({ slug });
    if (existing?.image) {
      await deleteImageByUrl(existing.image);
    }

    // 🔹 Update or insert
    const updated = await CategoryImage.findOneAndUpdate(
      { slug },
      { image: upload.secure_url },
      { new: true, upsert: true }
    );

    res.json({ category: updated });
  } catch (err) {
    console.error("Error saving category image:", err.message);
    res.status(500).json({ message: "Error saving category image" });
  }
});

export default router;
