import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { fetchCart, mergeGuestCart } from "../redux/slices/cartSlice";
import { logoutUser, registerUser } from "../redux/slices/authSlice"; // add logoutUser import
import { useDispatch, useSelector } from "react-redux";

import register from "../assets/register.webp";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { loading, error, user } = useSelector((state) => state.auth);
  const { guestId } = useSelector((state) => state.auth);

  // Handle navigation and cart merging after successful registration
  useEffect(() => {
    if (user) {
      // Merge guest cart with user cart after registration, then fetch updated cart
      if (guestId) {
        dispatch(mergeGuestCart({ userId: user._id, guestId }))
          .then(() => {
            dispatch(fetchCart({ userId: user._id, guestId }));
          });
      } else {
        dispatch(fetchCart({ userId: user._id, guestId }));
      }
      dispatch(logoutUser()); // clear user from Redux state
      navigate('/login');
    }
  }, [user, navigate, dispatch, guestId]);

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields", {
        description: "Name, email, password, and confirm password are required to create an account."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your password and confirm password are the same."
      });
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Register form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="max-w-md w-full">
          <form
            onSubmit={handleRegister}
            className="space-y-6 p-8 border shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Pickzy
            </h2>
            <p className="text-2xl text-gray-500 text-center font-bold mb-4">
              👋 Register Now!
            </p>
            <p className="text-sm text-gray-600 font-semibold mb-6">
              Create your account by filling the details below
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                placeholder="Your Name"
              />
            </div>

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
                placeholder="••••••••"
              />
              <p className="text-sm text-gray-500">(Password should be min 6 characters)</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                placeholder="Enter your password again"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-xl text-gray-600 mt-6 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Background Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={register}
          alt="Register illustration"
          className="w-full object-cover h-[850px]"
        />
      </div>
    </div>
  );
};

export default Register;
