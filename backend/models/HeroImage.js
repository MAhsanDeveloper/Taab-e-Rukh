import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Cloudinary URL
}, { timestamps: true });

export default mongoose.model("HeroImage", heroImageSchema);
