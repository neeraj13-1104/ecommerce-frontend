import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import React from "react";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH WISHLIST ================= */
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data.wishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE ================= */
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWishlist(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= MOVE TO CART ================= */
  const moveToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // remove from wishlist after adding to cart
      await removeFromWishlist(productId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ❤️</h1>

      {loading && <p>Loading wishlist...</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-500">No items in wishlist</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={
                item.thumbnail?.startsWith("http")
                  ? item.thumbnail
                  : `http://localhost:5000${item.thumbnail}`
              }
              className="h-40 w-full object-cover rounded"
            />

            <h2 className="mt-2 font-semibold truncate">
              {item.title}
            </h2>

            <p className="text-purple-600 font-bold mt-1">
              ₹ {item.price}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => moveToCart(item._id)}
                className="flex-1 bg-purple-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-purple-700"
              >
                <FaShoppingCart /> Cart
              </button>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
