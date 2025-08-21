import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Footer from "../Common/Footer";
import Header from "../Common/Header";
import { Outlet } from "react-router-dom";
import { fetchCart } from "../../redux/slices/cartSlice";

const UserLayout = () => {
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  
  // Initialize cart when the app loads
  useEffect(() => {
    const userId = user?._id;
    dispatch(fetchCart({ userId, guestId }));
  }, [dispatch, user, guestId]);

  // // Debug logging
   useEffect(() => {
  //   console.log("UserLayout - Current cart:", cart);
  //   console.log("UserLayout - Cart products count:", cart?.products?.length);
   }, [cart]);

  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default UserLayout;
