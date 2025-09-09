import express from "express";
import HeroImage from "../models/HeroImage.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const router = express.Router();

// ✅ Get all hero images
router.get("/", async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching images" });
  }
});

// ✅ Add hero image (limit 3)
router.post("/", async (req, res) => {
  try {
    const count = await HeroImage.countDocuments();
    if (count >= 3) {
      return res.status(400).json({ message: "Maximum of 3 hero images allowed" });
    }

    const { image } = req.body; // Base64 or image URL
    if (!image) return res.status(400).json({ message: "Image required" });

    // Upload to Cloudinary
    const upload = await uploadOnCloudinary(image);

    const newImage = await HeroImage.create({ url: upload.secure_url });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: "Error uploading image" });
  }
});

// ✅ Delete hero image
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HeroImage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Image deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
});

export default router;
