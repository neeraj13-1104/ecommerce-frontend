import React, { useEffect, useState } from "react";
import axios from "axios";

const HomeCarousel = ({ selectedCategory }) => {
  const [carousel, setCarousel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const fetchCarousel = async () => {
    try {
      const query = selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
      const res = await axios.get(`http://localhost:5000/api/carousel${query}`);
      setCarousel(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Carousel fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousel();
  }, [selectedCategory]);

  useEffect(() => {
    if (!carousel.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carousel.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carousel]);

  const prevSlide = () => setIndex((prev) => (prev - 1 + carousel.length) % carousel.length);
  const nextSlide = () => setIndex((prev) => (prev + 1) % carousel.length);

  if (loading) return <p className="text-center py-10">Loading carousel...</p>;
  if (!carousel.length) return <p className="text-center py-10">No carousel images</p>;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[180px] sm:h-[250px] md:h-[320px] lg:h-[400px] xl:h-[450px] rounded-md">
        {carousel.map((item, i) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={`http://localhost:5000/${item.image}`}
              alt={item.title}
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black/30 z-20 rounded-md" />
            <div className="absolute inset-0 z-30 flex items-center px-6 md:px-12">
              <div className="max-w-xl text-white">
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">{item.title}</h2>
                {item.subtitle && (
                  <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-200">
                    {item.subtitle}
                  </p>
                )}
                {item.cta && (
                  <button className="mt-4 px-5 py-2 bg-red-600 rounded-md hover:bg-red-700 transition">
                    {item.cta}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 -translate-y-1/2 z-40 bg-black/30 text-white text-xl px-2 py-1 rounded-full hover:bg-black/50"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 -translate-y-1/2 z-40 bg-black/30 text-white text-xl px-2 py-1 rounded-full hover:bg-black/50"
        >
          ❯
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {carousel.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                i === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;
