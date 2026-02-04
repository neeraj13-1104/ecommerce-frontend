import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  /* ===== STATUS BADGE ===== */
  const statusStyle = (status) => {
    const map = {
      PLACED: "bg-blue-100 text-blue-700",
      CONFIRMED: "bg-yellow-100 text-yellow-700",
      SHIPPED: "bg-purple-100 text-purple-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  const price = (v) => Number(v || 0).toFixed(2);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        🧾 My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-500 text-lg">
            You have not placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md border overflow-hidden"
            >
              {/* ===== HEADER ===== */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 px-6 py-4 bg-gray-50 border-b">
                <div>
                  <p className="text-xs text-gray-500">ORDER ID</p>
                  <p className="font-medium break-all text-gray-800">
                    {order._id}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`self-start px-4 py-1 rounded-full text-sm font-semibold ${statusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* ===== ITEMS ===== */}
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-4 px-6 py-4 items-start sm:items-center"
                  >
                    {/* IMAGE */}
                    <img
                      src={
                        item.product?.thumbnail
                          ? `${BASE_URL}${item.product.thumbnail}`
                          : "https://via.placeholder.com/120"
                      }
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/120")
                      }
                      alt={item.product?.title}
                      className="w-24 h-24 rounded-xl object-cover border"
                    />

                    {/* INFO */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {item.product?.title || "Product unavailable"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* PRICE */}
                    <div className="text-right font-semibold text-purple-600 text-lg">
                      ₹ {price(item.finalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              {/* ===== FOOTER ===== */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 px-6 py-4 bg-gray-50 border-t">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Subtotal: ₹ {price(order.cartTotal)}</p>
                  <p className="text-green-600">
                    Discount: -₹ {price(order.totalDiscount)}
                  </p>
                </div>

                <div className="text-2xl font-bold text-gray-800">
                  Total: ₹ {price(order.finalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
