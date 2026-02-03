import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OfferProducts = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const fetchOfferProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/offers/category-offer/${offerId}/products`
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Offer products fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferProducts();
  }, [offerId]);

  if (loading) {
    return <div className="p-10 text-center">Loading offer products...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Offer Products</h1>

      {products.length === 0 && (
        <p className="text-gray-500 text-center">
          No products found for this offer
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/product/${p.title}/${p._id}`)}
            className="bg-white rounded-xl border shadow hover:shadow-lg cursor-pointer"
          >
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
              <span className="font-bold text-green-600">
                ₹ {p.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferProducts;
