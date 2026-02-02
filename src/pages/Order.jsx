import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 mb-4 shadow">
            <p>
              <b>Order ID:</b> {order._id}
            </p>
            <p>
              <b>Status:</b> {order.status}
            </p>
            <p>
              <b>Total:</b> ₹ {order.totalAmount}
            </p>

            <div className="mt-2">
              <b>Items:</b>
              {order.items.map((item) => (
                <div key={item._id} className="ml-4 text-sm">
                  {item.product.title} × {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
