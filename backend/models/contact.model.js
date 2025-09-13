import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    phone: String,
    email: String,
    address: String,
    facebook: String,
    tiktok: String,
    instagram: String,
    youtube: String,
    whatsapp: String,
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
