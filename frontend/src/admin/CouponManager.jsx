import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    expirationDate: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/coupons/all");
      setCoupons(res.data);
    } catch {
      toast.error("Failed to fetch coupons");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post("/coupons", {
        ...form,
        discountPercentage: Number(form.discountPercentage),
      });
      toast.success("Coupon created");
      setForm({ code: "", discountPercentage: "", expirationDate: "" });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await axios.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Coupons</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 w-full uppercase"
          required
        />

        <input
          type="number"
          placeholder="Discount %"
          value={form.discountPercentage}
          onChange={(e) =>
            setForm({ ...form, discountPercentage: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <input
          type="date"
          value={form.expirationDate}
          onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          disabled={adding}
          className={`bg-amber-600 cursor-pointer text-white px-4 py-2 rounded transition ${
            adding ? "opacity-70 cursor-not-allowed" : "hover:bg-amber-700"
          }`}
        >
          {adding ? "Creating..." : "Create Coupon"}
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Existing Coupons</h3>
        <ul>
          {coupons.map((c) => (
            <li key={c._id} className="flex justify-between uppercase border-b py-2">
              <span>
                {c.code} — {c.discountPercentage}% (expires{" "}
                {new Date(c.expirationDate).toLocaleDateString()})
              </span>
              <button
                onClick={() => handleDelete(c._id)}
                disabled={deletingId === c._id}
                className={`bg-red-500 text-white cursor-pointer px-2 py-1 rounded transition ${
                  deletingId === c._id
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
              >
                {deletingId === c._id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CouponManager;
