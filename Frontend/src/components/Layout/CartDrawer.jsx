import React, { useEffect, useRef } from "react";

import CartContents from "../Cart/CartContents";
import { IoMdClose } from "react-icons/io";
import { fetchCart } from "../../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart, loading, error } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;
  const scrollRef = useRef(null);
  const drawerRef = useRef(null);
  
  // Debug logging
  // console.log("CartDrawer - cart:", cart);
  // console.log("CartDrawer - cart products:", cart?.products);
  // console.log("CartDrawer - cart products length:", cart?.products?.length);
  // console.log("CartDrawer - loading:", loading);
  // console.log("CartDrawer - error:", error);
  // console.log("CartDrawer - userId:", userId);
  // console.log("CartDrawer - guestId:", guestId);

  // Fetch cart when component mounts or user/guest changes
  useEffect(() => {
    if (userId || guestId) {
     // console.log("Fetching cart for:", { userId, guestId });
      dispatch(fetchCart({ userId, guestId }));
    }
  }, [dispatch, userId, guestId]);

  // Refetch cart when drawer opens
  useEffect(() => {
    if (drawerOpen && (userId || guestId)) {
    //  console.log("Cart drawer opened - refreshing cart");
      dispatch(fetchCart({ userId, guestId }));
    }
  }, [drawerOpen, dispatch, userId, guestId]);
  
  const handleCheckout = () => {
    toggleCartDrawer();
    if(!user){
      navigate("/login?redirect=/checkout");
      return;
    }else{
          navigate("/checkout");
    }
  };

  // Preserve scroll position when cart updates
  useEffect(() => {
    if (scrollRef.current && cart?.products?.length > 0) {
      // Maintain scroll position after item deletion
      const currentScrollTop = scrollRef.current.scrollTop;
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = Math.min(
            currentScrollTop,
            scrollRef.current.scrollHeight - scrollRef.current.clientHeight
          );
        }
      });
    }
  }, [cart?.products?.length]);

  const hasItems = cart && cart?.products && Array.isArray(cart.products) && cart.products.length > 0;

  // Close drawer when clicking outside
  useEffect(() => {
    if (!drawerOpen) return;
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        toggleCartDrawer();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [drawerOpen, toggleCartDrawer]);

  return (
    <>
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 md:w-[30rem] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 flex flex-col
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={toggleCartDrawer}
            className="text-gray-500 hover:text-black"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

       {/* Guest login message */}
{!user && (
  <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-2 rounded-lg mb-6 shadow-sm flex items-center justify-between">
    <p className="text-sm font-medium whitespace-nowrap">
      To save your cart and access it later, please log in.
    </p>
    <button
      onClick={() => {
        toggleCartDrawer();
        navigate("/login");
      }}
      className="ml-4 text-sm bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold px-4 py-1 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
      aria-label="Log in to save cart"
    >
      Log In
    </button>
  </div>
)}

        {/* Scrollable cart content */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-4 space-y-4"
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading cart...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Error loading cart</p>
              <p className="text-sm text-gray-400">{error}</p>
              <button 
                onClick={() => dispatch(fetchCart({ userId, guestId }))}
                className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
              >
                Try again
              </button>
            </div>
          ) : hasItems ? (
            <CartContents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">Your cart is empty.</p>
              <p className="text-sm text-gray-400">Add some items to get started!</p>
            </div>
          )}
        </div>

        {/* Checkout button fixed at the bottom - always rendered to prevent layout shift */}
        <div className={`p-4 bg-white flex-shrink-0 border-t transition-opacity duration-200 ${hasItems ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="mb-2">
            <p className="text-sm font-medium">
              Total Items: {cart?.totalItems || 0}
            </p>
            <p className="text-lg font-bold">
              Total: ${cart?.totalPrice?.toFixed(2) || '0.00'}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!hasItems || loading}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Checkout"}
          </button>
          <p className="text-xs text-gray-500 mt-2 tracking-tighter">
            Shipping, taxes, and discount codes calculated at checkout.
          </p>
        </div>
      </div>
    </>
  );
};
      
export default CartDrawer;