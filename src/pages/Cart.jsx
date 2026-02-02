import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";

const Cart = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // 🔹 Fetch cart
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);

  // 🔹 Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update quantity");
    }
  };

  // 🔹 Remove from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete("http://localhost:5000/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove product");
    }
  };

  // 🔹 Place Order
  const placeOrder = async () => {
    if (cart.items.length === 0) return alert("Cart is empty");
    try {
      setLoading(true);
      const items = cart.items
        .filter((item) => item.product)
        .map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }));

      if (items.length === 0) return alert("No valid products in cart");

      await axios.post(
        "http://localhost:5000/api/orders",
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Order placed successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Order failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.items.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty</p>
          ) : (
            cart.items.map((item) =>
              item.product ? (
                <div key={item.product._id} className="flex items-center gap-4 border rounded-lg p-3 shadow-sm">
                  <img
                    src={
                      item.product.thumbnail?.startsWith("http")
                        ? item.product.thumbnail
                        : `http://localhost:5000${item.product.thumbnail}`
                    }
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-lg">{item.product.title}</h3>
                    <p className="text-purple-600 font-bold">₹ {item.product.price}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <FaMinus />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="ml-auto text-red-600 hover:text-red-800 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={item._id || Math.random()} className="border rounded-lg p-3 shadow text-red-500">
                  Product not available
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              )
            )
          )}
        </div>

        {/* Summary */}
        <div className="border-t p-4">
          <p className="font-semibold mb-2">
            Total Items: {cart.items.filter((item) => item.product).length}
          </p>
          <p className="text-xl font-bold mb-4">Total: ₹ {totalPrice}</p>
          <button
            onClick={placeOrder}
            disabled={loading || cart.items.filter((item) => item.product).length === 0}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
