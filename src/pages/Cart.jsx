import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaMinus } from "react-icons/fa";

const BASE_URL = "http://localhost:5000";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [offers, setOffers] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState({});
  const token = localStorage.getItem("token");

  // 🔹 Fetch Cart
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch Active Offers
  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/offers/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchOffers();
  }, []);

  // 🔹 Change Quantity
  const changeQty = async (productId, newQty) => {
    try {
      if (newQty < 1) {
        await axios.delete(`${BASE_URL}/api/cart/remove`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId },
        });
        fetchCart();
        return;
      }

      await axios.put(
        `${BASE_URL}/api/cart/update`,
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQty }
            : item
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Apply Offer (per product)
  const applyOffer = async (offerId, productId) => {
    if (!offerId) {
      alert("Pehle offer select kar bhai 😅");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/cart/apply-offer`,
        { offerId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Offer not applicable ❌");
    }
  };

  // 🔹 Eligible offers by category
  const getEligibleOffers = (category) => {
    return offers.filter((offer) =>
      offer.categories.includes(category)
    );
  };

  // 🔹 Price Calculations
  const totalMRP = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalDiscount = cart.items.reduce(
    (sum, item) => sum + (item.discountAmount || 0),
    0
  );

  const payableAmount = totalMRP - totalDiscount;

  // 🔹 Place Order
  const placeOrder = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/orders/place`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully ✅");
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>

      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {/* 🔹 CART ITEMS */}
          <div className="space-y-4">
            {cart.items.map((item) => {
              const product = item.product;
              if (!product) return null;

              const eligibleOffers = getEligibleOffers(product.category);

              return (
                <div
                  key={product._id}
                  className="border p-3 rounded space-y-2"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={`${BASE_URL}${product.thumbnail}`}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h2 className="font-semibold">{product.title}</h2>
                      <p>₹ {product.price}</p>

                      {item.discountAmount > 0 && (
                        <p className="text-green-600 text-sm">
                          Discount: ₹ {item.discountAmount}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          changeQty(product._id, item.quantity - 1)
                        }
                        className="p-2 bg-gray-200 rounded"
                      >
                        <FaMinus />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          changeQty(product._id, item.quantity + 1)
                        }
                        className="p-2 bg-gray-200 rounded"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  {/* 🔹 OFFER SECTION */}
                  {eligibleOffers.length > 0 ? (
                    <div className="flex gap-2 items-center">
                      <select
                        className="border px-3 py-2 rounded"
                        value={selectedOffers[product._id] || ""}
                        onChange={(e) =>
                          setSelectedOffers({
                            ...selectedOffers,
                            [product._id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Offer</option>
                        {eligibleOffers.map((offer) => (
                          <option key={offer._id} value={offer._id}>
                            {offer.title}
                          </option>
                        ))}
                      </select>

                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() =>
                          applyOffer(
                            selectedOffers[product._id],
                            product._id
                          )
                        }
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No offers available
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 🔹 PRICE SUMMARY */}
          <div className="border-t mt-6 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹ {totalMRP}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Total Discount</span>
              <span>- ₹ {totalDiscount}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Payable Amount</span>
              <span>₹ {payableAmount}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full mt-4 bg-black text-white py-3 rounded text-lg"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
