import { Link } from "react-router-dom";
import React from "react";

const ProductGrid = ({ products,loading,error}) => {
    if(loading){
      return <p>Loading...</p>
    }
  
    if(error){
      return <p className="text-red-500">Error: {error}</p>
    }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`}>
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-80 mb-4">
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            </div>
            <h3 className="mb-2 text-lg">{product.name}</h3>
            <p className="text-gray-700 font-medium text-lg tracking-tighter">
              {`$ ${product.price}`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
