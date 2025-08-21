import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
const [newArrivals, setNewArrivals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  // Fetch new arrivals from API 
  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
     // console.log("Fetching new arrivals from:", `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
      );
     // console.log("New arrivals response:", response.data);
      setNewArrivals(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to load new arrivals");
    } finally {
      setLoading(false);
    }
  };

  fetchNewArrivals();
}, []);

  const handleOnMouseDown = (e) => {
    // Don't start dragging if clicking on a link
    if (e.target.closest('a')) return;
    
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleOnMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setHasDragged(true);
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleOnMouseUpOrLeave = () => {
    setIsDragging(false);
    // Reset hasDragged after a short delay to allow click events to check it
    setTimeout(() => setHasDragged(false), 100);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  //update scroll buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
      };
    }
  }, [newArrivals]);

  return (
    <section id="new-arrivals" className="py-16 px-4 lg:px-0">
      {/* Header */}
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg border-1
           ${canScrollLeft ? "bg-white text-black" : "bg-gray-400 cursor-not-allowed"}`}
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg border-1
           ${canScrollRight ? "bg-white text-black" : "bg-gray-400 cursor-not-allowed"}`}
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <p>Loading new arrivals...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Scrollable Product Cards */}
      {!loading && !error && (
        <div className="overflow-x-scroll px-4">
        <div
          ref={scrollRef}
          className={`container mx-auto overflow-x-scroll flex space-x-4 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleOnMouseDown}
          onMouseMove={handleOnMouseMove}
          onMouseLeave={handleOnMouseUpOrLeave}
          onMouseUp={handleOnMouseUpOrLeave}
        >
          {newArrivals.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] bg-white rounded-lg relative block"
              onClick={(e) => {
                // Prevent navigation if we were dragging
                if (hasDragged) {
                  e.preventDefault();
                }
              }}
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-[400px] object-cover rounded-lg"
                draggable="false"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
              <div className="p-4  absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white rounded-b-lg">
                {/* Replace inner Link with span to avoid <a> inside <a> */}
                <span className="block text-lg font-semibold hover:underline">
                  {product.name}
                </span>
                <p className="mt-1">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
