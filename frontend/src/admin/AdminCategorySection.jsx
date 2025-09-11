/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const hardcodedCategories = [
   { name: "All Products", slug: "all-products" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Skin Care", slug: "skin-care" },
  { name: "Face & Glow", slug: "face-glow" },
  { name: "Body & Baby", slug: "body-baby" },
];

const AdminCategorySection = () => {
  const [categories, setCategories] = useState([]);

  // Fetch category images
  const fetchCategories = async () => {
    try {
    const res = await axios.get("/category-images");

      const imageMap = res.data.images.reduce((acc, img) => {
        acc[img.slug] = img.image;
        return acc;
      }, {});

      const merged = hardcodedCategories.map((cat) => ({
        ...cat,
        image: imageMap[cat.slug] || "",
        preview: imageMap[cat.slug] || "",
        file: null,
      }));

      setCategories(merged);
    } catch (err) {
      toast.error("Failed to load category images");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

 const updateCategory = async (slug, file) => {
  if (!file) return toast.error("Please select an image first");

  try {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
    const { data } = await axios.post("/category-images", { slug, image: reader.result },
    );

      toast.success("Image updated successfully");
      fetchCategories();
    };
  } catch {
    toast.error("Failed to update image");
  }
};

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Category Carousel Images</h2>

      {/* Categories List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="bg-white p-4 rounded shadow flex flex-col items-center gap-3"
          >
            <h3 className="font-semibold">{cat.name}</h3>
            <img
              src={cat.preview || "/images/placeholder.jpg"}
              className="w-28 h-28 object-cover rounded"
              alt={cat.name}
            />

            <label className="bg-amber-600 text-white px-3 py-1 rounded cursor-pointer">
              {cat.file ? "Change Image" : "Upload Image"}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setCategories((prev) =>
                    prev.map((c) =>
                      c.slug === cat.slug
                        ? { ...c, file, preview: URL.createObjectURL(file) }
                        : c
                    )
                  );
                }}
                className="hidden"
              />
            </label>

            <button
              onClick={() => updateCategory(cat.slug, cat.file)}
              disabled={!cat.file}
              className={`px-4 py-1 rounded text-white ${
                cat.file
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategorySection;
