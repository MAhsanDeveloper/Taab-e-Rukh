import CategoryImage from "../models/categoryImage.model.js";

// Get all category images
export const getCategoryImages = async (req, res) => {
  try {
    const images = await CategoryImage.find({});
    res.status(200).json({ images });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category images" });
  }
};

// Admin: Add/Update category image
export const upsertCategoryImage = async (req, res) => {
  try {
    const { slug, image } = req.body;
    if (!slug || !image) {
      return res.status(400).json({ message: "Slug and image are required" });
    }

    const updated = await CategoryImage.findOneAndUpdate(
      { slug },
      { image },
      { new: true, upsert: true }
    );

    res.status(200).json({ category: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to save category image" });
  }
};
