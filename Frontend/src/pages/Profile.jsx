import React, { useState } from "react";
import { logout, updateProfile } from "../redux/slices/authSlice"; // <-- your real thunk
import { useDispatch, useSelector } from "react-redux";

import MyOrdersPage from "./MyOrdersPage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleEditOpen = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Password validation
  if (form.password) {
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  }

  setLoading(true);
  try {
    await dispatch(updateProfile(form)).unwrap();
    setEditOpen(false);

    // Reset form with updated user info
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  } catch (err) {
    setError(err.message || "Failed to update profile");
  }
  setLoading(false);
};


  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left section - Profile Info */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-2 border-gray-100 shadow-lg rounded-xl p-8">
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="text-center">
                <h2 className="text-xl font-medium text-green-600 uppercase tracking-wider mb-2">
                  Welcome Back
                </h2>
                <div className="w-12 h-1 bg-green-500 rounded-full mx-auto"></div>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <h1 className="text-2xl font-bold text-gray-800 mt-1">
                    {user?.name || "John Doe"}
                  </h1>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-gray-800 mt-1 break-all">
                    {user?.email || "john@example.com"}
                  </p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="pt-2">
                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-2"
                  onClick={handleEditOpen}
                >
                  Edit Profile
                </button>
              </div>
              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Right section - Orders Table */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={handleEditClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
              Edit Profile
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repeat new password"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
