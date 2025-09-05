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
import { useAuth0 } from "@auth0/auth0-react";
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
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

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

    try {
      let token = "";
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const result = await dispatch(
        addToCart({
          productId: productfetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          userId,
          guestId,
          token,
        })
      );

      if (addToCart.fulfilled.match(result)) {
        toast.success("Product added to cart successfully!", {
          description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added in ${selectedSize} size and ${selectedColor} color.`,
          duration: 2000,
        });
        setSelectedSize("");
        setSelectedColor("");
        setQuantity(1);
      } else {
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
  <div className="p-3 text-sm">
      {selectedProduct && (
  <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-2 mr-4">
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
              <div className="mb-2">
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
            <div className="md:hidden flex overflow-x-scroll space-x-2 mb-4 pb-1">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => handleImageChange(image.url)}
                  className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0
                   ${mainImage === image.url ? "border-black shadow-lg" : "border-gray-300"}`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                  }}
                />
              ))}
            </div>

            {/* Right side - Product Details */}
            <div className="md:w-1/2 md:ml-6">
              <h1 className="text-lg md:text-xl font-semibold mb-1">
                {selectedProduct.name}
              </h1>
              {selectedProduct.originalPrice && (
                <p className="text-base text-gray-600 mb-1 line-through">
                  ${selectedProduct.originalPrice}
                </p>
              )}
              <p className="text-lg font-bold text-gray-900 mb-2">
                ${selectedProduct.price}
              </p>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Color Selection - Using Utility Functions */}
              <div className="mb-4">
                <p className="text-gray-700 font-medium mb-2">Color:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color) => {
                    const colorHex = getColorHex(color);
                    const isSelected = selectedColor === color;
                    const borderClass = getColorButtonBorder(colorHex, isSelected);
                    const textColorClass = getContrastTextColor(colorHex);
                    
                    return (
                      <div key={color} className="flex flex-col items-center">
                        <button
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 flex items-center justify-center ${borderClass}`}
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
                        <span className="text-[10px] text-gray-600 mt-1 text-center max-w-[50px] truncate">
                          {color}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {selectedColor && (
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Selected: {selectedColor}
                  </p>
                )}
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <p className="text-gray-700 font-medium mb-2">Size:</p>
                <div className="flex gap-1 flex-wrap">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded border-2 transition-colors duration-200 font-medium text-xs
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
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Selected: {selectedSize}
                  </p>
                )}
              </div>

              {/* Quantity Selection */}
              <div className="mb-4">
                <p className="text-gray-700 font-medium mb-2">Quantity:</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    disabled={quantity <= 1}
                    className={`w-8 h-8 rounded bg-gray-200 text-base font-bold transition-colors duration-200
                      ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                  >
                    -
                  </button>
                  <span className="text-base font-medium min-w-[1.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="w-8 h-8 rounded bg-gray-200 text-base font-bold hover:bg-gray-300 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-4 rounded-md w-full mb-4 font-medium text-sm transition-colors duration-200
                  ${isButtonDisabled 
                    ? "cursor-not-allowed opacity-50" 
                    : "hover:bg-gray-800"
                  }`}
              >
                {isButtonDisabled ? "Adding..." : "Add to Cart"}
              </button>

              {/* Product Characteristics */}
              <div className="mt-4">
                <h3 className="text-base font-semibold mb-2">Characteristics:</h3>
                <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="p-2 font-medium text-gray-700 border-b border-gray-200">
                        Brand:
                      </td>
                      <td className="p-2 text-gray-900 border-b border-gray-200">
                        {selectedProduct.brand}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-gray-700">
                        Material:
                      </td>
                      <td className="p-2 text-gray-900">
                        {selectedProduct.material}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          <div className="mt-10">
            <h2 className="text-3xl text-center font-bold mb-4">
              You May Also Like
            </h2>
            <div className="[&_.w-full]:w-40 [&>div]:gap-6 [&_img]:rounded-md">
              <ProductGrid products={similarProducts} loading={loading} error={error} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;