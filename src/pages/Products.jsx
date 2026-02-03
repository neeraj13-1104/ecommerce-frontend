import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShareAlt, FaTags } from "react-icons/fa";
import Offers from "../pages/Offers";

const Products = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const makeSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/products/cart", {
        params: {
          page: pageNumber,
          limit,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        },
      });

      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Product fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= WISHLIST ================= */
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistIds(res.data.wishlist.map((p) => p._id));
    } catch (err) {
      console.error("Wishlist fetch error", err);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* ================= ACTIONS ================= */
  const addToCart = async (id) => {
    if (!token) return alert("Please login first");
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // alert("✅ Added to cart");
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  const toggleWishlist = async (e, id) => {
    e.stopPropagation();
    if (!token) return alert("Please login first");

    try {
      if (wishlistIds.includes(id)) {
        await axios.delete(
          `http://localhost:5000/api/wishlist/remove/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistIds((prev) => prev.filter((x) => x !== id));
      } else {
        await axios.post(
          "http://localhost:5000/api/wishlist/add",
          { productId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistIds((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error("Wishlist error", err);
    }
  };

  const shareProduct = (p) => {
    const url = `${window.location.origin}/product/${makeSlug(p.title)}/${p._id}`;
    navigator.share
      ? navigator.share({ title: p.title, url }).catch(console.error)
      : navigator.clipboard.writeText(url);
  };

  if (loading) return <div className="p-10 text-center">Loading products...</div>;

  /* ================= PAGINATION NUMBERS ================= */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);

      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* 🔥 SPECIAL OFFERS HEADING */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className="flex items-center gap-2">
          <FaTags className="text-orange-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            Special Offers
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          Limited time deals for you
        </span>
      </div>

      {/* 🔥 OFFERS SECTION */}
      <div className="mb-12">
        <Offers isCarouselView />
      </div>

      {/* 🔹 PRODUCTS */}
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {products.length === 0 && (
        <div className="text-center text-gray-500">No products found</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/product/${makeSlug(p.title)}/${p._id}`)}
            className="relative bg-white rounded-xl border shadow hover:shadow-lg cursor-pointer"
          >
            <button
              onClick={(e) => toggleWishlist(e, p._id)}
              className={`absolute top-3 right-3 text-xl ${
                wishlistIds.includes(p._id)
                  ? "text-red-600"
                  : "text-red-300"
              }`}
            >
              <FaHeart />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                shareProduct(p);
              }}
              className="absolute top-3 right-10 text-xl text-blue-500"
            >
              <FaShareAlt />
            </button>

            <div className="h-52 bg-gray-100 flex justify-center items-center">
              <img
                src={getImageUrl(p.thumbnail)}
                alt={p.title}
                className="h-full object-contain p-4"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-500">Stock: {p.stock}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-green-600">₹ {p.price}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p._id);
                  }}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {getPageNumbers().map((num, idx) =>
            num === "..." ? (
              <span key={idx} className="px-2">...</span>
            ) : (
              <button
                key={idx}
                onClick={() => setPage(num)}
                className={`px-3 py-1 border rounded ${
                  num === page ? "font-bold border-black" : ""
                }`}
              >
                {num}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
