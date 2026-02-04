import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_URL;

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("token");
  const [mainImage, setMainImage] = useState(""); // initial empty string

  // 🔹 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/products/detail/${id}`
        );
        if (res.data.success) {
          setProduct(res.data.data);
          // 🔹 set mainImage after product loads
          setMainImage(res.data.data.images?.[0] || res.data.data.thumbnail);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // 🔹 Add to Cart
  const addToCart = async () => {
    if (!product) return;
    if (!token) return alert("Please login first");

    try {
      await axios.post(
        "${BASE_URL}/api/cart/add",
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Product added to cart");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add to cart");
    }
  };

  if (!product)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Loading product...
      </p>
    );

  // 🔹 Rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} className="text-yellow-500" />);
      else if (i - rating < 1) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  // 🔹 Helper for absolute URL
  const getImageUrl = (img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* IMAGE CAROUSEL */}
      <div className="space-y-4">
        <img
          src={getImageUrl(mainImage)}
          alt={product.title}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />

        <div className="flex gap-2 overflow-x-auto">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={getImageUrl(img)}
              alt={`${product.title}-${i}`}
              className="w-20 h-20 object-cover rounded cursor-pointer border hover:border-purple-600"
              onClick={() => setMainImage(img)} // ✅ safe update
            />
          ))}
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="flex flex-col justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-2">
            <Link to="/">Home</Link> / <span className="capitalize">{product.category}</span>
          </div>

          <h1 className="text-4xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center mt-2 space-x-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-gray-600 text-sm">({product.reviews?.length || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-4">
            {product.discountPercentage ? (
              <>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{(product.price * (1 - product.discountPercentage / 100)).toFixed(0)}
                </p>
                <p className="text-gray-400 line-through">₹{product.price}</p>
                <p className="text-green-600 font-semibold">{product.discountPercentage}% OFF</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-purple-600">₹{product.price}</p>
            )}
          </div>

          {/* Stock */}
          <p className={`mt-2 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>

          {/* Description */}
          <p className="mt-4 text-gray-700">{product.description}</p>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 p-2 border rounded text-center"
            />
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>

          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            Add to Cart
          </button>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((rev, i) => (
                <div key={i} className="border p-4 rounded shadow-sm">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{rev.reviewerName}</p>
                    <div className="flex">{renderStars(rev.rating)}</div>
                  </div>
                  <p className="text-gray-700 mt-2">{rev.comment}</p>
                  <p className="text-gray-400 text-sm mt-1">{new Date(rev.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
