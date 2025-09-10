import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import {
  uploadOptimizedImage,
  uploadOptimizedBase64,
  deleteImageByUrl,
} from "../lib/cloudinaryUpload.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get featured products (with Redis cache)
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      hasDiscount,
      discountRate,
      available,
      sold,
      inStock,
    } = req.body;

    let mainImageUrl = "";
    let previewUrls = [];

    // 🔹 Multer file uploads
    if (req.files?.mainImage) {
      const uploadRes = await uploadOptimizedImage(req.files.mainImage[0].buffer);
      mainImageUrl = uploadRes.secure_url;
    }

    if (req.files?.previewImages) {
      for (const file of req.files.previewImages) {
        const uploadRes = await uploadOptimizedImage(file.buffer);
        previewUrls.push(uploadRes.secure_url);
      }
    }

    // 🔹 Base64 / remote uploads
    if (req.body.image && !mainImageUrl) {
      const uploadRes = await uploadOptimizedBase64(req.body.image);
      mainImageUrl = uploadRes.secure_url;
    }

    if (req.body.previewImages && previewUrls.length === 0) {
      const previews = Array.isArray(req.body.previewImages)
        ? req.body.previewImages
        : [req.body.previewImages];

      for (const img of previews) {
        const uploadRes = await uploadOptimizedBase64(img);
        previewUrls.push(uploadRes.secure_url);
      }
    }

    // 🔹 Save to MongoDB
    const product = await Product.create({
      name,
      description,
      price,
      category,
      hasDiscount,
      discountRate,
      available,
      sold,
      inStock,
      mainImage: mainImageUrl,
      previewImages: previewUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product (and images)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // delete images
    await deleteImageByUrl(product.mainImage);
    for (const img of product.previewImages || []) {
      await deleteImageByUrl(img);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product and images deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product (and replace images if uploaded)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // mainImage
    if (req.files?.mainImage) {
      await deleteImageByUrl(product.mainImage);
      const uploadRes = await uploadOptimizedImage(req.files.mainImage[0].buffer);
      req.body.mainImage = uploadRes.secure_url;
    }

    // previewImages
    if (req.files?.previewImages) {
      for (const img of product.previewImages || []) {
        await deleteImageByUrl(img);
      }

      const previewUrls = [];
      for (const file of req.files.previewImages) {
        const uploadRes = await uploadOptimizedImage(file.buffer);
        previewUrls.push(uploadRes.secure_url);
      }
      req.body.previewImages = previewUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Other routes
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          mainImage: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.error("Error in getRecommendedProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: new RegExp(req.params.category, "i") },
    });
    res.json({ products });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updateFeaturedProductsCache();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in toggleFeaturedProduct:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in update cache function");
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
