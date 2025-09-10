import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

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

    // 🔹 Case 1: FormData (multer) uploads
    if (req.files?.mainImage) {
      const mainImg = req.files.mainImage[0];
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(mainImg.buffer);
      });
      mainImageUrl = uploadRes.secure_url;
    }

    if (req.files?.previewImages) {
      for (const file of req.files.previewImages) {
        const uploadRes = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        previewUrls.push(uploadRes.secure_url);
      }
    }

    // 🔹 Case 2: Base64 (HeroManager style)
    if (req.body.image && !mainImageUrl) {
      const uploadRes = await cloudinary.uploader.upload(req.body.image, {
        folder: "products",
      });
      mainImageUrl = uploadRes.secure_url;
    }

    if (req.body.previewImages && previewUrls.length === 0) {
      const previews = Array.isArray(req.body.previewImages)
        ? req.body.previewImages
        : [req.body.previewImages];

      for (const img of previews) {
        const uploadRes = await cloudinary.uploader.upload(img, {
          folder: "products",
        });
        previewUrls.push(uploadRes.secure_url);
      }
    }

    // 🔹 Create Product
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
    console.error("Error in createProduct controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If updating images
    if (req.files?.mainImage) {
      const mainImg = req.files.mainImage[0];
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(mainImg.buffer);
      });
      req.body.mainImage = uploadRes.secure_url;
    }

    if (req.files?.previewImages) {
      const previewUrls = [];
      for (const file of req.files.previewImages) {
        const uploadRes = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        previewUrls.push(uploadRes.secure_url);
      }
      req.body.previewImages = previewUrls;
    }

    // Update product with new data
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({
      category: { $regex: new RegExp(category, "i") }
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
