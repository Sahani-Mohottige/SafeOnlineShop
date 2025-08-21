import React, { useEffect, useState } from "react";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
// Import color utilities
import {
  getColorButtonBorder,
  getColorHex,
  getContrastTextColor
} from "../../utils/color";

import ProductGrid from "./ProductGrid";
import { addToCart } from "../../redux/slices/cartSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, similarProducts, loading, error } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productfetchId = productId || id;
  const userId = user ? user._id : null;

  useEffect(() => {
    if (productfetchId) {
      dispatch(fetchProductDetails(productfetchId));
      dispatch(fetchSimilarProducts(productfetchId));
    }
  }, [dispatch, productfetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleImageChange = (imageUrl) => {
    setMainImage(imageUrl);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
  };

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        description: "Both size and color must be selected to add the item to your cart.",
        duration: 2000,
      });
      return;
    }

    setIsButtonDisabled(true);

    // console.log("Adding to cart with data:", {
    //   productId: productfetchId,
    //   quantity,
    //   size: selectedSize,
    //   color: selectedColor,
    //   userId,
    //   guestId,
    // });

    try {
      const result = await dispatch(
        addToCart({
          productId: productfetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          userId,
          guestId,
        })
      );

    //  console.log("Add to cart result:", result);

      if (addToCart.fulfilled.match(result)) {
        toast.success("Product added to cart successfully!", {
          description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added in ${selectedSize} size and ${selectedColor} color.`,
          duration: 2000,
        });
        
        setSelectedSize("");
        setSelectedColor("");
        setQuantity(1);
      } else {
       // console.error("Add to cart failed:", result.payload);
        toast.error("Failed to add product to cart", {
          description: result.payload?.message || "Something went wrong",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add product to cart", {
        description: "Something went wrong",
        duration: 2000,
      });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => handleImageChange(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105
                   ${mainImage === image.url ? "border-black shadow-lg" : "border-gray-300 hover:border-gray-400"}`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                  }}
                />
              ))}
            </div>

            {/* Main image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Mobile version thumbnails */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mb-6 pb-2">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => handleImageChange(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0
                   ${mainImage === image.url ? "border-black shadow-lg" : "border-gray-300"}`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                  }}
                />
              ))}
            </div>

            {/* Right side - Product Details */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>
              {selectedProduct.originalPrice && (
                <p className="text-lg text-gray-600 mb-1 line-through">
                  ${selectedProduct.originalPrice}
                </p>
              )}
              <p className="text-2xl font-bold text-gray-900 mb-4">
                ${selectedProduct.price}
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Color Selection - Using Utility Functions */}
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">Color:</p>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.colors.map((color) => {
                    const colorHex = getColorHex(color);
                    const isSelected = selectedColor === color;
                    const borderClass = getColorButtonBorder(colorHex, isSelected);
                    const textColorClass = getContrastTextColor(colorHex);
                    
                    return (
                      <div key={color} className="flex flex-col items-center">
                        <button
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 flex items-center justify-center ${borderClass}`}
                          style={{
                            backgroundColor: colorHex,
                          }}
                          title={color}
                        >
                          {isSelected && (
                            <span className={`text-xs font-bold ${textColorClass}`}>
                              ✓
                            </span>
                          )}
                        </button>
                        <span className="text-xs text-gray-600 mt-1 text-center max-w-[60px] truncate">
                          {color}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Selected: {selectedColor}
                  </p>
                )}
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">Size:</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border-2 transition-colors duration-200 font-medium
                        ${selectedSize === size 
                          ? "bg-black text-white border-black" 
                          : "bg-white text-black border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Selected: {selectedSize}
                  </p>
                )}
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">Quantity:</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 rounded bg-gray-200 text-lg font-bold transition-colors duration-200
                      ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                  >
                    -
                  </button>
                  <span className="text-lg font-medium min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="w-10 h-10 rounded bg-gray-200 text-lg font-bold hover:bg-gray-300 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-3 px-6 rounded-lg w-full mb-6 font-medium transition-colors duration-200
                  ${isButtonDisabled 
                    ? "cursor-not-allowed opacity-50" 
                    : "hover:bg-gray-800"
                  }`}
              >
                {isButtonDisabled ? "Adding..." : "Add to Cart"}
              </button>

              {/* Product Characteristics */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Characteristics:</h3>
                <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="p-3 font-medium text-gray-700 border-b border-gray-200">
                        Brand:
                      </td>
                      <td className="p-3 text-gray-900 border-b border-gray-200">
                        {selectedProduct.brand}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Material:
                      </td>
                      <td className="p-3 text-gray-900">
                        {selectedProduct.material}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-8">
              You May Also Like
            </h2>
            <div className="[&_.w-full]:w-60 [&>div]:gap-10 [&_img]:rounded-md">
              <ProductGrid products={similarProducts} loading={loading} error={error} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;