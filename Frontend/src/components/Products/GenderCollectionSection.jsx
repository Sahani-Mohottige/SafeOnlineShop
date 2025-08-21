import { Link } from "react-router-dom";
import React from "react";
import mensCollectionImg from "../../assets/men.jpg";
import womensCollectionImg from "../../assets/women.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="px-4 py-16 md:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women's Collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionImg}
            alt="Women's Collection"
            className="w-full h-[700px] object-cover rounded-lg shadow-lg"
          />
          <div
            className="absolute bottom-8 left-8 bg-opacity-90 bg-amber-50
           p-5 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 "
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionImg}
            alt="Men's Collection"
            className="w-full h-[700px] object-cover rounded-lg shadow-lg"
          />
          <div
            className="absolute bottom-8 left-8 bg-opacity-90 bg-amber-50
           p-5 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-gray-900  mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
