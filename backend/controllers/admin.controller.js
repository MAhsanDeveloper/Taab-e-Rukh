import User from "../models/user.model.js";

export const createAdmin = async (req, res) => {
  try {
    const { name, email, mobileNumber ,password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const admin = await User.create({ name, email, mobileNumber, password, role: "admin" });
    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
