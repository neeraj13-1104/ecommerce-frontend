import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Offers = ({ isCarouselView = false }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH ACTIVE CATEGORY OFFERS ================= */
  const fetchOffers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/offers/active"
      );
      setOffers(res.data?.offers || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  /* ================= FORMAT CATEGORY ================= */
  const formatCategory = (cat) => {
    if (!cat) return "";
    return cat.replace(/-/g, " ").toUpperCase();
  };

  /* ================= STYLING FOR CAROUSEL VIEW ================= */
  const containerClass = isCarouselView
    ? "flex space-x-4 overflow-x-auto py-4 px-2 snap-x snap-mandatory"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

  const cardClass = isCarouselView
    ? "min-w-[220px] bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition flex-shrink-0 snap-start cursor-pointer"
    : "bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer";

  return (
    <div className={isCarouselView ? "" : "bg-gray-100 min-h-screen p-6"}>
      {/* SECTION TITLE */}
      {!isCarouselView && (
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaTag className="text-purple-600" />
          Active Category Offers
        </h1>
      )}

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">Loading offers...</p>
      )}

      {/* NO OFFERS */}
      {!loading && offers.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No active offers available.
        </p>
      )}

      {/* OFFER CARDS */}
      <div className={containerClass}>
        {offers.map((offer) => (
          <div
            key={offer._id}
            className={cardClass}
            onClick={() => navigate(`/offer/${offer._id}`)} // 🔥 ONLY ADDITION
          >
            {/* BANNER IMAGE */}
            <div className="relative">
              <img
                src={`http://localhost:5000${offer.bannerImage}`}
                alt={offer.title}
                className="h-40 w-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded shadow">
                {offer.discountValue}
                {offer.discountType === "PERCENT" ? "%" : "₹"} OFF
              </span>
            </div>

            {/* OFFER DETAILS */}
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2 truncate">
                {offer.title}
              </h2>

              {/* MULTIPLE CATEGORIES */}
              <p className="text-gray-600 text-sm mb-1">Categories:</p>
              <div className="flex flex-wrap gap-2">
                {offer.categories?.map((cat, index) => (
                  <span
                    key={`${offer._id}-${index}`}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                  >
                    {formatCategory(cat)}
                  </span>
                ))}
              </div>

              {offer.minCartValue > 0 && (
                <p className="text-gray-600 text-sm mt-2">
                  Min Cart: ₹{offer.minCartValue}
                </p>
              )}

              <div className="mt-2 text-xs text-gray-500">
                <p>Start: {new Date(offer.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(offer.endDate).toLocaleDateString()}</p>
              </div>

              {!isCarouselView && (
                <span className="inline-block mt-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  ACTIVE
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
