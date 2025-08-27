import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { clearCart } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = location.state?.order;
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate("/cart");
    } else {
      dispatch(clearCart());
    }
  }, [order, navigate, dispatch]);

  const getDeliveryDate = (order) => {
    // Use the selected date from the purchase form
    return order.dateOfPurchase
      ? new Date(order.dateOfPurchase).toLocaleDateString()
      : "Not specified";
  };

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg relative">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>
      <p className="text-center text-2xl text-gray-500">Your Order Details</p>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-white hover:text-gray bg-red-600 py-1 px-3 rounded-md text-2xl font-bold"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 mt-6">What would you like to do next?</h2>
            <div className="flex flex-col gap-4">
              <button
                className="bg-emerald-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-emerald-700 transition-all"
                onClick={() => navigate("/profile")}
              >
                Redirect to My Orders
              </button>
              <button
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 transition-all"
                onClick={() => navigate("/")}
              >
                Redirect to Home Page
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Next button above the footer */}
      <div className="flex justify-end mt-8">
        <button
          className="bg-emerald-600 text-white py-2 px-6 rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition-all z-40"
          onClick={() => setShowPopup(true)}
        >
          Next
        </button>
      </div>
      <div className="space-y-6">
        <div className="border-b pb-4 grid grid-cols-2">
          {/*Order Id and Date */}
          <div className="mb-2 text-gray-700 ">
            <h2 className="text-lg font-semibold">
              Order ID: {order._id}
            </h2>
            <p className="text-lg">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {/*Estimated Delivery */}
            <p className="text-emerald-700">
              Estimated Delivery: {getDeliveryDate(order)}
            </p>
          </div>
        </div>
        {/*Ordered Item */}
        <div className="space-y-4">
          {(order.checkoutItems || order.products || []).map((item, idx) => {
            // Use item.image if available, fallback to placeholder
            let imageUrl = item.image;
            if (!imageUrl) {
              imageUrl = "https://picsum.photos/500/500?random=" + idx;
            }
            return (
              <div
                key={item.productId || idx}
                className="flex items-center mb-4 p-4 rounded-md shadow-sm"
              >
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">${item.price}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {/*Payment and Delivery Info*/}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-8 pt-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">Cash on Delivery</h4>
            <p className="text-gray-700">Cash</p>
          </div>
          {/*Delivery Info*/}
          <div>
            <h4 className="font-semibold text-lg mb-1">Delivery</h4>
            <p className="text-gray-700">
              {order.shippingAddress?.address || order.deliveryLocation}
            </p>
            <p className="text-gray-700">
              {order.shippingAddress?.city || ""}
              {order.shippingAddress?.country ? ", " + order.shippingAddress.country : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
