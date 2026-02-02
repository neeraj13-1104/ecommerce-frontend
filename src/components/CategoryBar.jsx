import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaThLarge,
  FaMobileAlt,
  FaLaptop,
  FaCouch,
  FaTshirt,
  FaShoppingBag,
  FaGem,
  FaShoePrints,
  FaRegClock,
} from "react-icons/fa";

const CategoryBar = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/categories")
      .then((res) => {
        setCategories(["all", ...res.data.data]);
      })
      .catch(() => {});
  }, []);

  const iconMap = {
    all: <FaThLarge />,
    smartphones: <FaMobileAlt />,
    laptops: <FaLaptop />,
    furniture: <FaCouch />,
    "mens-shirts": <FaTshirt />,
    "womens-dresses": <FaShoppingBag />,
    "womens-jewellery": <FaGem />,
    "mens-shoes": <FaShoePrints />,
    "womens-shoes": <FaShoePrints />,
    "mens-watches": <FaRegClock />,
    "womens-watches": <FaRegClock />,
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-7 overflow-x-auto scrollbar-hide">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? "text-purple-600 font-bold"
                : "text-gray-700 hover:text-purple-600"
            }`}
            onClick={() => onSelectCategory(cat)}
          >
            <span className="text-base">{iconMap[cat] || <FaShoppingBag />}</span>
            <span className="capitalize">
              {cat === "all" ? "All" : cat.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
