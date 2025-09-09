import { useEffect, useState } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/payments/orders`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadInvoice = (orderId) => {
    window.open(`${baseURL}/api/orders/${orderId}/invoice`, "_blank");
  };

  const handleDownloadPackSlip = (orderId) => {
    window.open(`${baseURL}/api/orders/${orderId}/pack-slip`, "_blank");
  };

  return (
    <section className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Order Manager</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Address</th>
              <th className="p-3">Total (PKR)</th>
              <th className="p-3">Items</th>
              <th className="p-3">Coupon</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    {order.shippingDetails?.fullName || order.user?.name || "Guest"}
                  </td>
                  <td className="p-3">
                    {order.shippingDetails?.email || order.user?.email || "N/A"}
                  </td>
                  <td className="p-3">{order.paymentMethod || "N/A"}</td>
                  <td className="p-3">
                    {order.shippingDetails
                      ? `${order.shippingDetails.address}, ${order.shippingDetails.city}`
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    {(order.totalAmount ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {order.products?.length ? (
                      <ul className="list-disc ml-4 space-y-1">
                        {order.products.map((item, idx) => (
                          <li key={idx}>
                            {item.product?.name || item.product} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No items</span>
                    )}
                  </td>
                  <td className="p-3">{order.couponCode || "—"}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleDownloadInvoice(order._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 my-2 py-2 rounded text-sm"
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => handleDownloadPackSlip(order._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Pack Slip
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No orders placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderManager;
