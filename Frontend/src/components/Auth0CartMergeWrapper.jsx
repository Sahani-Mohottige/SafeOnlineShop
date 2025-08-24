import React, { useEffect, useRef } from "react";
import { fetchCart, mergeGuestCart, refreshCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import App from "../App.jsx";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Auth0CartMergeWrapper = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const guestId = useSelector((state) => state.auth.guestId);
  const hasMergedRef = useRef(false); // run merge only once per session

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || hasMergedRef.current) return;

      try {
        const token = await getAccessTokenSilently();

        // Fetch user profile to get MongoDB _id
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userId = res.data._id;

        // Update Redux auth state
        dispatch({ type: 'auth/loginUser/fulfilled', payload: res.data });

        let mergedCart = null;

        // Merge guest cart if it exists
        if (guestId) {
          mergedCart = await dispatch(mergeGuestCart({ userId, guestId, token })).unwrap();
          dispatch(refreshCart(mergedCart));
          dispatch({ type: 'auth/generateNewGuestId' });
          localStorage.removeItem('guestId');
        }

        // Always fetch user's previous cart (after merge if any)
        const userCart = await dispatch(fetchCart({ userId, token })).unwrap();

        // If merge happened, backend should return the merged cart; otherwise fetch previous cart
        if (!mergedCart || !mergedCart.products || mergedCart.products.length === 0) {
          dispatch(refreshCart(userCart));
        }

        hasMergedRef.current = true; // mark as merged/fetched
      } catch (err) {
        console.error("Failed to load user cart:", err);
      }
    };

    loadCart();
  }, [isAuthenticated, guestId, getAccessTokenSilently, dispatch]);

  return <App />;
};

export default Auth0CartMergeWrapper;
