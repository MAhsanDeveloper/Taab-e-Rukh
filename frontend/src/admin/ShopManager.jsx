/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const categories = [
  { name: "Hair Care", slug: "hair-care" },
  { name: "Skin Care", slug: "skin-care" },
  { name: "Body Care", slug: "body-care" },
];

const ShopManager = () => {
  const [products, setProducts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    benefits: "",
    description: "",
    price: "",
    size: "",
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

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/shop");
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  const addProduct = async () => {
    setAdding(true);
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

      await axios.post("/shop", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added");
      resetNewProduct();
      fetchProducts();
    } catch {
      toast.error("Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      benefits: "",
      description: "",
      price: "",
      size: "",
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

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await axios.delete(`/shop/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const updateProduct = async (id) => {
    try {
      await axios.put(`/shop/${id}`, editForm, {
        headers: { "Content-Type": "application/json" },
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
      const res = await axios.get("/spotlight");
      setSpotlightCategories(res.data.categories || []);
    } catch {
      toast.error("Failed to load spotlight categories");
    }
  };

  const updateSpotlight = async () => {
    try {
      await axios.put(
        "/spotlight",
        { categories: spotlightCategories },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Spotlight updated");
    } catch {
      toast.error("Failed to update spotlight");
    }
  };

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
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Size"
              value={newProduct.size}
              onChange={(e) =>
                setNewProduct({ ...newProduct, size: e.target.value })
              }
              className="w-1 pl-1 rounded border flex-1"
            />

            <select
              value={newProduct.sizeUnit}
              onChange={(e) =>
                setNewProduct({ ...newProduct, sizeUnit: e.target.value })
              }
              className="p-2 rounded border"
            >
              <option value="ml">ml</option>
              <option value="g">g</option>
              <option value="mg">mg</option>
              <option value="l">l</option>
              <option value="oz">oz</option>
            </select>
          </div>

          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value,
              })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Benefits"
            value={newProduct.benefits}
            onChange={(e) =>
              setNewProduct({ ...newProduct, benefits: e.target.value })
            }
            className="p-2 rounded border col-span-full"
          />
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
            disabled={adding}
            className={`flex items-center justify-center gap-2 bg-amber-800 text-white py-2 px-4 rounded font-bold transition ${
              adding
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-amber-900 cursor-pointer"
            }`}
          >
            {adding ? (
              <>
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                </span>
                Adding...
              </>
            ) : (
              "Add Product"
            )}
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
                <input
                  type="number"
                  defaultValue={p.size}
                  onChange={(e) =>
                    setEditForm({ ...editForm, size: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />

                <select
                  defaultValue={p.sizeUnit}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sizeUnit: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                >
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="l">l</option>
                  <option value="oz">oz</option>
                </select>
                <input
                  type="text"
                  defaultValue={p.benefits}
                  onChange={(e) =>
                    setEditForm({ ...editForm, benefits: e.target.value })
                  }
                  className="p-2 border rounded w-full whitespace-pre-line line-clamp-3"
                />
                <textarea
                  defaultValue={p.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="p-2 border rounded w-full whitespace-pre-line line-clamp-3"
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
                <p className="text-sm whitespace-pre-line line-clamp-3">
                  {p.benefits}
                </p>
                <p className="text-sm">{p.size}</p>
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
                    className="bg-blue-100 text-blue-600 cursor-pointer px-3 py-1 rounded text-sm hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    disabled={deletingId === p._id}
                    className={`flex items-center justify-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded text-sm transition ${
                      deletingId === p._id
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-red-200 cursor-pointer"
                    }`}
                  >
                    {deletingId === p._id ? (
                      <>
                        <span className="flex gap-1">
                          <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></span>
                        </span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>

                  {/* Featured Toggle */}
                  <button
                    onClick={async () => {
                      try {
                        await axios.patch(`/shop/${p._id}`);
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
                    className={`px-3 py-1 rounded cursor-pointer text-sm hover:bg-gray-300 ${
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
    </div>
  );
};

export default ShopManager;
