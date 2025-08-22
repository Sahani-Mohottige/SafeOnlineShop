import React, { useEffect } from "react";
import { fetchCart, mergeGuestCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import App from "../App.jsx";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Auth0CartMergeWrapper = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const guestId = useSelector((state) => state.auth.guestId);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const mergeCart = async () => {
      if (isAuthenticated && guestId) {
        const token = await getAccessTokenSilently();
        // Fetch user profile from backend to get MongoDB _id
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userId = res.data._id;
          // Update Redux auth state with MongoDB _id
          dispatch({ type: 'auth/loginUser/fulfilled', payload: res.data });
          await dispatch(mergeGuestCart({ userId, guestId, token }));
          // Clear guestId from Redux and localStorage after merge
          dispatch({ type: 'auth/generateNewGuestId' });
          localStorage.removeItem('guestId');
          // Immediately fetch the updated user cart
          dispatch(fetchCart({ userId, token }));
        } catch (err) {
          console.error("Failed to fetch user profile for cart merge:", err);
        }
      }
    };
    mergeCart();
  }, [isAuthenticated, guestId, getAccessTokenSilently, dispatch]);

  return <App />;
};

export default Auth0CartMergeWrapper;
