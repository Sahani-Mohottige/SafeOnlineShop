import React, { useEffect } from "react";
import { fetchCart, removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import { RiDeleteBin3Line } from "react-icons/ri";
import { toast } from "sonner";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  // Fetch cart on component mount if not provided as prop
  useEffect(() => {
    if (!cart) {
      dispatch(fetchCart({ userId: user?._id, guestId }));
    }
  }, [dispatch, user, guestId, cart]);

  // Handle quantity increase
  const handleIncreaseQuantity = async (product) => {
    try {
      await dispatch(updateCartItemQuantity({
        productId: product.productId,
        quantity: product.quantity + 1,
        userId: userId || user?._id,
        guestId,
        size: product.size,
        color: product.color,
      })).unwrap();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity", {
        description: "Please try again or refresh the page."
      });
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = async (product) => {
    if (product.quantity > 1) {
      try {
        await dispatch(updateCartItemQuantity({
          productId: product.productId,
          quantity: product.quantity - 1,
          userId: userId || user?._id,
          guestId,
          size: product.size,
          color: product.color,
        })).unwrap();
      } catch (err) {
        console.error("Failed to update quantity:", err);
        toast.error("Failed to update quantity", {
          description: "Please try again or refresh the page."
        });
      }
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = async (product) => {
    try {
      await dispatch(removeFromCart({
        productId: product.productId,
        userId: userId || user?._id,
        guestId,
        size: product.size,
        color: product.color,
      })).unwrap();
      toast.success("Item removed from cart", {
        description: `${product.name} has been removed from your cart.`
      });
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item", {
        description: "Please try again or refresh the page."
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 px-4">
        <p className="text-center py-8">Loading cart...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 px-4">
        <p className="text-center py-8 text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Show empty cart
  if (!cart?.products || cart.products.length === 0) {
    return (
      <div className="space-y-6 px-4">
        <p className="text-center py-8 text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4">
      {cart.products.map((product, index) => (
        <div key={index} className="flex items-start gap-4 border-b pb-6">
          {/* Product image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover rounded-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x240?text=No+Image';
              }}
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col flex-grow">
            <h3 className="text-sm font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Size: {product.size} | Color: {product.color}
            </p>

            {/* Quantity controls */}
            <div className="flex items-center gap-2 mt-3">
              <button 
                className="border rounded px-2 text-xl font-medium hover:bg-gray-200"
                onClick={() => handleDecreaseQuantity(product)}
                disabled={loading}
              >
                -
              </button>
              <span className="text-sm font-medium">{product.quantity}</span>
              <button 
                className="border rounded px-2 text-xl font-medium hover:bg-gray-200"
                onClick={() => handleIncreaseQuantity(product)}
                disabled={loading}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <p>${(product.price * product.quantity)?.toLocaleString()}</p> 
            <button
              className="mt-4 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove item"
              onClick={() => handleRemoveFromCart(product)}
              disabled={loading}
            >
              <RiDeleteBin3Line className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
