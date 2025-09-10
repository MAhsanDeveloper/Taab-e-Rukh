import cloudinary from "./cloudinary.js";

const defaultTransform = [
  { width: 1000, quality: "auto:good", fetch_format: "webp" }
];

const heroTransform = [
  { width: 1920, quality: "auto:good", crop: "scale", fetch_format: "webp" }
];

// upload from buffer (multer) - products
export const uploadOptimizedImage = (fileBuffer, publicId = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: "products",
      transformation: defaultTransform,
      ...(publicId ? { public_id: publicId } : {})
    };

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });

    stream.end(fileBuffer);
  });
};

// upload product image (base64/URL)
export const uploadOptimizedBase64 = (fileString, publicId = null) => {
  return cloudinary.uploader.upload(fileString, {
    folder: "products",
    transformation: defaultTransform,
    ...(publicId ? { public_id: publicId } : {})
  });
};

// upload hero image (base64/URL)
export const uploadHeroImage = (fileString, publicId = null) => {
  return cloudinary.uploader.upload(fileString, {
    folder: "hero",
    transformation: heroTransform,
    ...(publicId ? { public_id: publicId } : {})
  });
};

export const deleteImageByUrl = async (url) => {
  if (!url) return;
  const parts = url.split("/");
  const folder = parts[parts.length - 2]; // "products" or "hero"
  const publicId = parts.pop().split(".")[0];
  try {
    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  } catch (err) {
    console.log("Cloudinary delete error:", err.message);
  }
};
