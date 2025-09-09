import express from "express";
import CategoryImage from "../models/categoryImage.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const router = express.Router();

// get all
router.get("/", async (req, res) => {
  try {
    const images = await CategoryImage.find();
    res.json({ images });
  } catch {
    res.status(500).json({ message: "Error fetching category images" });
  }
});

// upsert (add/update by slug)
router.post("/", async (req, res) => {
  try {
    const { slug, image } = req.body;
    if (!slug || !image) return res.status(400).json({ message: "slug + image required" });

    const upload = await uploadOnCloudinary(image);

    const updated = await CategoryImage.findOneAndUpdate(
      { slug },
      { image: upload.secure_url },
      { new: true, upsert: true }
    );

    res.json({ category: updated });
  } catch {
    res.status(500).json({ message: "Error saving category image" });
  }
});

export default router;
