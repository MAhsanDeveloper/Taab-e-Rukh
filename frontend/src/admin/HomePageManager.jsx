/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const HomePageManager = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/hero-images");
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch images");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first");

    setUploading(true);
    setError("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const { data } = await axios.post("/hero-images", {
          image: reader.result,
        });
        setImages((prev) => [data, ...prev]);
        setFile(null);
        setPreview(null);
      } catch (err) {
        setError(err.response?.data?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    };
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await axios.delete(`/hero-images/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      setError("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Home Page Hero Images</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Upload Section */}
      <div className="mb-6">
        {images.length < 3 ? (
          <div className="flex gap-4 items-center flex-wrap">
            {/* Custom file input */}
            <label className="cursor-pointer px-4 py-2 bg-gray-200 rounded-md text-black hover:bg-gray-300 transition">
              {file ? file.name : "Choose File"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className={`px-4 py-2 rounded-md cursor-pointer text-white transition ${
                uploading || !file
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            {/* Preview Section */}
            {preview && (
              <div className="relative border rounded-lg overflow-hidden w-48 h-52">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-fill"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-500">Maximum 3 images allowed.</p>
        )}
      </div>

      {/* Display Uploaded Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative border rounded-lg overflow-hidden group w-full h-52">
            <img src={img.url} alt="Hero" className="w-full h-full object-fill" />
            <button
              onClick={() => handleDelete(img._id)}
              disabled={deletingId === img._id}
              className={`absolute top-2 right-2 px-2 py-1 rounded-md cursor-pointer text-sm transition ${
                deletingId === img._id
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {deletingId === img._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageManager;
