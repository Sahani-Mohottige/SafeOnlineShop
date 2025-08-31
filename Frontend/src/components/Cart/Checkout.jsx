import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ErrorBoundary from "../Common/ErrorBoundary";
// PayPalButton removed. No PayPal integration.
import PurchaseForm from "./PurchaseForm";
import { fetchCart } from "../../redux/slices/cartSlice";
import { useAuth0 } from "@auth0/auth0-react";

const Checkout = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  // ...existing code...
  
  // Get the cart state - the actual cart data is in cartState.cart
  const cartState = useSelector((state) => state.cart);
  const { cart, loading, error } = cartState;
  
  // Extract cart items and total from the cart object
  const actualCartItems = cart?.products || [];
  const actualTotalAmount = cart?.totalPrice;
  
  const { user, guestId } = useSelector((state) => state.auth);

  // ...existing code...
  useEffect(() => {
    const fetchCartWithAuth0 = async () => {
      const userId = user ? user._id : null;
      if (userId || guestId) {
        let token = "";
        if (isAuthenticated) {
          token = await getAccessTokenSilently();
        }
        dispatch(fetchCart({ userId, guestId, token }));
      }
    };
    fetchCartWithAuth0();
  }, [dispatch, user, guestId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="text-center">Loading checkout...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="text-center text-red-600">
          Error loading cart: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto py-10 px-6">
      {/* Left Section: Purchase Form */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>
        <ErrorBoundary>
          <PurchaseForm />
        </ErrorBoundary>
      </div>
      {/* Right Section: Order Summary */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {actualCartItems && Array.isArray(actualCartItems) && actualCartItems.length > 0 ? (
          actualCartItems.map((item, index) => (
            <div
              key={item._id || item.productId || index}
              className="flex items-start justify-between py-2 border-t border-blue-300"
            >
              <div className="flex items-start">
                <img
                  src={item.image || "https://via.placeholder.com/80x80?text=No+Image"}
                  alt={item.name || "Product"}
                  className="w-20 h-20 rounded object-cover"
                />
              </div>
              <div>
                <h3 className="text-md">{item.name}</h3>
                <p className="text-gray-600">Size: {item.size}</p>
                <p className="text-gray-600">Color: {item.color}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div>
                <p className="font-bold">
                  ${(item.price * item.quantity)?.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {loading ? "Loading cart..." : "Your cart is empty"}
            </p>
          </div>
        )}
        <hr className="my-4 border-gray-500" />
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal:</p>
          <p>${actualTotalAmount?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg font-bold mb-4">
          <p>Total:</p>
          <p className="font-bold text-xl">
            ${actualTotalAmount?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
