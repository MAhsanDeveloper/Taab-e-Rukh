import multer from "multer";

// store in memory (so we can convert to base64 if needed)
const storage = multer.memoryStorage();

// optional: filter only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ This middleware will not throw errors if no files are uploaded.
// It supports both mainImage + previewImages but also works when client sends only JSON.
export const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "previewImages", maxCount: 3 },
]);

export const uploadCategoryImage = upload.single("image");