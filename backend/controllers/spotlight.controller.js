import Spotlight from "../models/spotlight.model.js";

// Get spotlight categories (public)
export const getSpotlight = async (req, res) => {
  try {
    const spotlight = await Spotlight.findOne().sort({ createdAt: -1 });
    res.json(spotlight || { categories: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Update spotlight categories
export const updateSpotlight = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories) || categories.length > 4) {
      return res.status(400).json({
        message: "You must provide an array with up to 4 categories."
      });
    }

    let spotlight = await Spotlight.findOne();
    if (spotlight) {
      spotlight.categories = categories;
      await spotlight.save();
    } else {
      spotlight = await Spotlight.create({ categories });
    }

    res.json(spotlight);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
