import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      folder: "homepage_hero",
    });
    return res;
  } catch (err) {
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadOnCloudinary;
