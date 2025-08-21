import { Link, useNavigate } from "react-router-dom";
import { fetchCart, mergeGuestCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(""); // Add local error state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const { guestId } = useSelector((state) => state.auth);

  // Navigate to home after successful login and merge guest cart
  useEffect(() => {
    if (user) {
      // Merge guest cart with user cart after login, then fetch updated cart
      if (guestId) {
        dispatch(mergeGuestCart({ userId: user._id, guestId }))
          .then(() => {
            // Fetch the updated cart after merging
            dispatch(fetchCart({ userId: user._id, guestId }));
          });
      } else {
        // If no guest cart, just fetch user cart
        dispatch(fetchCart({ userId: user._id, guestId }));
      }
      navigate('/');
    }
  }, [user, navigate, dispatch, guestId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError(""); // Reset error
    // Basic client-side validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="max-w-md w-full">
          <form
            onSubmit={handleLogin}
            className=" space-y-6 p-8 border shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
             Pickzy
            </h2>
            <p className="text-2xl text-gray-500 text-center font-bold mb-4">
              {" "}
              Hey There!👋
            </p>
            <p className="text-sm text-gray-600  font-semibold mb-6">
              Enter any valid email and password (min. 6 characters) to login
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                placeholder="Password (min. 6 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-xl text-gray-600 mt-6 text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Background Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={login}
          alt="Login to account"
          className="w-full object-cover h-[900px]"
        />
      </div>
    </div>
  );
};

export default Login;
