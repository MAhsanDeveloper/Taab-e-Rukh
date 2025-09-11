/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const HomePageManager = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first");

    setLoading(true);
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
      } catch (err) {
        setError(err.response?.data?.message || "Upload failed");
      } finally {
        setLoading(false);
      }
    };
  };

  const handleDelete = async (id) => {
    try {
    await axios.delete(`/hero-images/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      setError("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Home Page Hero Images</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Upload Section */}
      <div className="mb-6">
        {images.length < 3 ? (
          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-black"
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        ) : (
          <p className="text-red-500">Maximum 3 images allowed.</p>
        )}
      </div>

      {/* Display Uploaded Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.isArray(images) &&
          images.map((img) => (
            <div
              key={img._id}
              className="relative border rounded-lg overflow-hidden"
            >
              <img
                src={img.url}
                alt="Hero"
                className="w-full h-48 object-fill"
              />
              <button
                onClick={() => handleDelete(img._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomePageManager;
