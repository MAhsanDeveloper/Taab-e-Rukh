/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const categories = ["Hair Care", "Skin Care", "Face & Glow ", "Body & Baby"];

const ShopManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    hasDiscount: false,
    discountRate: 0,
    available: 0,
    sold: 0,
    inStock: true,
    mainImage: null,
    mainImagePreview: null,
    previewImages: [],
    previewPreviews: [],
  });

  const [spotlightCategories, setSpotlightCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/shop`, {
        withCredentials: true,
      });
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  // Add product
  const addProduct = async () => {
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key === "previewImages") {
          value.forEach((file) => formData.append("previewImages", file));
        } else if (key === "mainImage") {
          if (value) formData.append("mainImage", value);
        } else {
          formData.append(key, value);
        }
      });

      await axios.post(`${baseURL}/api/shop`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Product added");
      resetNewProduct();
      fetchProducts();
    } catch {
      toast.error("Failed to add product");
    }
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      hasDiscount: false,
      discountRate: 0,
      available: 0,
      sold: 0,
      inStock: true,
      mainImage: null,
      mainImagePreview: null,
      previewImages: [],
      previewPreviews: [],
    });
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/shop/${id}`, {
        withCredentials: true,
      });
      toast.success("Deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Update product
  const updateProduct = async (id) => {
    try {
      await axios.put(`${baseURL}/api/shop/${id}`, editForm, {
        withCredentials: true,
      });
      toast.success("Updated");
      setEditingId(null);
      setEditForm({});
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };

const fetchSpotlight = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/spotlight`);
    setSpotlightCategories(res.data.categories || []);
  } catch {
    toast.error("Failed to load spotlight categories");
  }
};

const updateSpotlight = async () => {
  try {
    await axios.put(
      `${baseURL}/api/spotlight`,
      { categories: spotlightCategories },
      { withCredentials: true }
    );
    toast.success("Spotlight updated");
  } catch {
    toast.error("Failed to update spotlight");
  }
};

useEffect(() => {
  fetchSpotlight();
}, []);


  // Image handlers
  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({
        ...prev,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handlePreviewImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setNewProduct((prev) => ({
      ...prev,
      previewImages: files,
      previewPreviews: files.map((f) => URL.createObjectURL(f)),
    }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-amber-600 text-white p-6 rounded-xl max-w-screen-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Manage Shop</h2>

      {/* New Product Form */}
      <div className="bg-white text-black p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="p-2 rounded border"
          />
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase().replace(/\s+/g, "-")}>
                {cat}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="p-2 rounded border col-span-full"
          />

          <label className="bg-amber-700 text-white px-3 py-1 rounded cursor-pointer">
            Main Image
            <input type="file" onChange={handleMainImage} className="hidden" />
          </label>
          {newProduct.mainImagePreview && (
            <img
              src={newProduct.mainImagePreview}
              className="w-24 h-24 object-cover rounded"
            />
          )}

          <label className="bg-amber-700 text-white px-3 py-1 rounded cursor-pointer">
            Preview Images (max 3)
            <input
              type="file"
              multiple
              onChange={handlePreviewImages}
              className="hidden"
            />
          </label>
          <div className="flex gap-2">
            {newProduct.previewPreviews.map((url, i) => (
              <img
                key={i}
                src={url}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.hasDiscount}
              onChange={(e) =>
                setNewProduct({ ...newProduct, hasDiscount: e.target.checked })
              }
            />
            Apply Discount
          </label>
          <input
            type="number"
            placeholder="Discount %"
            value={newProduct.discountRate}
            disabled={!newProduct.hasDiscount}
            onChange={(e) =>
              setNewProduct({ ...newProduct, discountRate: e.target.value })
            }
            className="p-2 rounded border"
          />

          <input
            type="number"
            placeholder="Available Stock"
            value={newProduct.available}
            onChange={(e) =>
              setNewProduct({ ...newProduct, available: e.target.value })
            }
            className="p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Sold"
            value={newProduct.sold}
            onChange={(e) =>
              setNewProduct({ ...newProduct, sold: e.target.value })
            }
            className="p-2 rounded border"
          />

          <button
            onClick={addProduct}
            className="bg-amber-800 hover:bg-amber-900 cursor-pointer text-white py-2 px-4 rounded font-bold"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white text-black p-4 rounded shadow relative"
          >
            {p.hasDiscount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {p.discountRate}% OFF
              </span>
            )}
            <img
              src={
                p.mainImage?.startsWith("http")
                  ? p.mainImage
                  : `${baseURL}${p.mainImage}`
              }
              alt={p.name}
              className="w-full h-40 object-fill rounded"
            />

            {editingId === p._id ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  defaultValue={p.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />
                <textarea
                  defaultValue={p.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />
                <input
                  type="number"
                  defaultValue={p.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />
                <button
                  onClick={() => updateProduct(p._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 text-black px-3 py-1 rounded text-sm ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold mt-2">{p.name}</h3>
                <p className="text-sm">{p.description}</p>
                <p className="text-sm">Rs {p.price}</p>
                <p className="text-xs">
                  Stock: {p.available} | Sold: {p.sold}
                </p>
                <p className="text-xs text-gray-500">Category: {p.category}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingId(p._id);
                      setEditForm(p);
                    }}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>

                  {/* Featured Toggle */}
                  <button
                    onClick={async () => {
                      try {
                        await axios.patch(
                          `${baseURL}/api/shop/${p._id}`,
                          {},
                          { withCredentials: true }
                        );
                        toast.success(
                          `Product ${
                            p.isFeatured ? "unmarked" : "marked"
                          } as Featured`
                        );
                        fetchProducts();
                      } catch {
                        toast.error("Failed to toggle Featured status");
                      }
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      p.isFeatured
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {p.isFeatured ? "Featured" : "Mark Featured"}
                  </button>
                </div>
              </>
              
            )}
          </div>
        ))}
      </div>

      <div className="bg-white text-black p-6 rounded-xl shadow mt-10 mx-1">
  <h3 className="text-xl font-semibold mb-4">Spotlight Categories</h3>
  <p className="text-sm mb-2">Choose up to 4 categories to spotlight on homepage</p>

  <div className="flex flex-wrap gap-3">
    {categories.map((cat) => {
      const slug = cat.toLowerCase().replace(/\s+/g, "-");
      const selected = spotlightCategories.includes(slug);

      return (
        <button
          key={slug}
          onClick={() => {
            if (selected) {
              setSpotlightCategories(spotlightCategories.filter((c) => c !== slug));
            } else if (spotlightCategories.length < 4) {
              setSpotlightCategories([...spotlightCategories, slug]);
            } else {
              toast.error("Maximum 4 spotlight categories allowed");
            }
          }}
          className={`px-4 py-2 rounded ${
            selected ? "bg-amber-600 text-white" : "bg-gray-200"
          }`}
        >
          {cat}
        </button>
      );
    })}
  </div>

  <button
    onClick={updateSpotlight}
    className="mt-4 bg-amber-800 text-white px-4 py-2 rounded"
  >
    Save Spotlight
  </button>
</div>

    </div>
  );
};

export default ShopManager;
