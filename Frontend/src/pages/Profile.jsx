import MyOrdersPage from "./MyOrdersPage";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Please log in to view your profile.</h2>
      </div>
    );
  }

  // Auth0 user fields: nickname, name, email, phone_number, locale, etc.
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
                    Username
                  </label>
                  <h1 className="text-lg font-bold text-gray-800 mt-1">
                    {user?.nickname || user?.username || "-"}
                  </h1>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <h1 className="text-2xl font-bold text-gray-800 mt-1">
                    {user?.name || "-"}
                  </h1>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-gray-800 mt-1 break-all">
                    {user?.email || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Number
                  </label>
                  <p className="text-gray-800 mt-1">
                    {user?.phone_number || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </label>
                  <p className="text-gray-800 mt-1">
                    {user?.country || user?.locale || "-"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right section - Purchase Form and Orders Table */}
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-8">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
