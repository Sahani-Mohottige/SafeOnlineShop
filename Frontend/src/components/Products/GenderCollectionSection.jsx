import { Link } from "react-router-dom";
import React from "react";
import mensCollectionImg from "../../assets/men.jpg";
import womensCollectionImg from "../../assets/women.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="px-4 py-16 md:px-0">
  <div className="container mx-auto flex flex-col md:flex-row gap-8 justify-center">
        {/* Women's Collection */}
        <div className="relative w-[500px] h-[500px] flex-shrink-0">
          <img
            src={womensCollectionImg}
            alt="Women's Collection"
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
          <div
            className="absolute bottom-6 left-6 bg-opacity-90 bg-amber-50 p-4 rounded-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 text-base"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative w-[500px] h-[500px] flex-shrink-0">
          <img
            src={mensCollectionImg}
            alt="Men's Collection"
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
          <div
            className="absolute bottom-6 left-6 bg-opacity-90 bg-amber-50 p-4 rounded-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900 text-base"
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
