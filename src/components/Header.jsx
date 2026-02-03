import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaTag,
  FaShoppingCart,
  FaPercent,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import axios from "axios";

const Header = ({ onLogout, onCartOpen }) => {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/auth");
  };

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/wishlist/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWishlistCount(res.data.count || 0))
      .catch(() => {});
  }, [token]);

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/products")}
        >
          <img
            src="/favicon.png"
            alt="MyStore"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-2xl font-bold hover:text-purple-400">
            MyStore
          </h1>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* NAV */}
        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-6 items-center
          absolute md:static top-16 left-0 w-full md:w-auto
          bg-gray-900 md:bg-transparent
          px-6 py-6 md:p-0 z-50`}
        >
          <Link
            to="/products"
            className="hover:text-purple-400"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>

          <Link
            to="/offers"
            className="flex items-center gap-1 text-green-400 hover:text-green-300 font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            <FaPercent />
            Offers
          </Link>

          <span
            className="cursor-pointer hover:text-purple-400"
            onClick={() => {
              navigate("/cart");
              setMenuOpen(false);
            }}
          >
            <FaShoppingCart className="text-xl" />
          </span>

          <span
            className="cursor-pointer flex items-center gap-1 hover:text-yellow-400"
            onClick={() => {
              navigate("/orders");
              setMenuOpen(false);
            }}
          >
            <FaTag />
            Orders
          </span>

          <Link
            to="/wishlist"
            className="relative"
            onClick={() => setMenuOpen(false)}
          >
            <FaHeart className="text-xl text-red-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full md:w-auto justify-center"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
