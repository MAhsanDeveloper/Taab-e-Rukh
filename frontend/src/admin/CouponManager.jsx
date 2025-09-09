import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    expirationDate: "",
  });

const fetchCoupons = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/coupons/all`, {
      withCredentials: true,
    });
    setCoupons(res.data);
  } catch {
    toast.error("Failed to fetch coupons");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(
      `${baseURL}/api/coupons`,     
      {
        ...form,
        discountPercentage: Number(form.discountPercentage),
      },
      { withCredentials: true }
    );
    toast.success("Coupon created");
    setForm({ code: "", discountPercentage: "", expirationDate: "" });
    fetchCoupons();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to create coupon");
  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`${baseURL}/api/coupons/${id}`, { withCredentials: true });
    toast.success("Coupon deleted");
    fetchCoupons();
  } catch {
    toast.error("Failed to delete coupon");
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
          className="border p-2 w-full"
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
          onChange={(e) =>
            setForm({ ...form, expirationDate: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          Create Coupon
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Existing Coupons</h3>
        <ul>
          {coupons.map((c) => (
            <li key={c._id} className="flex justify-between border-b py-2">
              <span>
                {c.code} — {c.discountPercentage}% (expires{" "}
                {new Date(c.expirationDate).toLocaleDateString()})
              </span>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CouponManager;
